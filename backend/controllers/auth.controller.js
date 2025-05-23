const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "gymSyncSecret"; // Fallback to hardcoded secret

exports.register = async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    const { name, email, password, role, gymName, location, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields. Please provide name, email, password, and role." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Map frontend role names to database role names if needed
    const roleMap = {
      "Gym Owner": "gymOwner",
      "Trainer": "trainer",
      "Member": "member",
      "Super Admin": "superAdmin"
    };
    
    // Use the mapped role or the provided role if it's already in the correct format
    const dbRole = roleMap[role] || role;

    // Don't allow Super Admin registration through the API
    if (dbRole === "superAdmin") {
      return res.status(403).json({ message: "Super Admin cannot self-register." });
    }

    // Validate gym details for Gym Owners
    if (dbRole === "gymOwner" && !gymName) {
      return res.status(400).json({ message: "Gym Name is required for Gym Owners." });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email is already registered. Please use a different email or login with your existing account." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: dbRole,
      status: dbRole === "gymOwner" ? "pending" : "approved", // Only gym owners need approval
      isApproved: dbRole !== "gymOwner", // Auto-approve non-gym owners
      gymName: gymName || "",
      location: location || "",
      phone: phone || "",
      createdAt: new Date()
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log(`User registered successfully: ${savedUser.email} (${savedUser.role})`);

    // For development/testing, log the approval status
    if (savedUser.role === "gymOwner") {
      console.log(`Gym owner pending approval: ${savedUser.email}, Gym: ${savedUser.gymName}`);
    }

    // Different message based on role
    const message = dbRole === "gymOwner" 
      ? "Gym owner registered successfully. Await Super Admin approval."
      : "Registered successfully. You can now log in.";

    return res.status(201).json({ 
      message,
      userId: savedUser._id,
      role: savedUser.role,
      status: savedUser.status
    });
  } catch (err) {
    console.error("Registration error:", err);
    
    // More detailed error message
    let errorMessage = "Server error during registration";
    let statusCode = 500;
    
    if (err.code === 11000) {
      errorMessage = "Email already exists. Please use a different email address.";
      statusCode = 409;
    } else if (err.name === 'ValidationError') {
      errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
      statusCode = 400;
    } else if (err.name === 'MongoServerError') {
      errorMessage = "Database error. Please try again later.";
    }
    
    return res.status(statusCode).json({ message: errorMessage });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Map frontend role to database role
    const roleMap = {
      "Gym Owner": "gymOwner",
      "Trainer": "trainer", 
      "Member": "member",
      "Super Admin": "superAdmin"
    };
    
    const dbRole = roleMap[role];
    
    if (user.role !== dbRole) {
      return res.status(403).json({ message: "Invalid role." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Incorrect password." });

    if (user.role === "gymOwner" && !user.isApproved) {
      return res.status(403).json({ message: "Awaiting Super Admin approval." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name }, 
      SECRET, 
      { expiresIn: "2d" }
    );

    return res.json({ 
      token, 
      user: { 
        id: user._id, 
        role: user.role, 
        name: user.name
      } 
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// Create a Super Admin account if none exists
exports.createSuperAdmin = async () => {
  try {
    const superAdminExists = await User.findOne({ role: "superAdmin" });
    
    if (!superAdminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      const superAdmin = new User({
        name: "Super Admin",
        email: "admin@gymsync.com",
        password: hashedPassword,
        role: "superAdmin", 
        status: "approved",
        isApproved: true
      });
      
      await superAdmin.save();
      console.log("Super Admin account created successfully.");
    }
  } catch (err) {
    console.error("Error creating Super Admin:", err);
  }
}; 