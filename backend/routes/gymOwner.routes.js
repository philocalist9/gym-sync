const express = require('express');
const router = express.Router();
const { verifyToken, isGymOwner } = require('../middlewares/auth');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');

// 🧑 Get gym owner profile
router.get('/profile', verifyToken, isGymOwner, async (req, res) => {
  try {
    const owner = await User.findById(req.user.id).select('-password');
    if (!owner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    res.status(200).json(owner);
  } catch (error) {
    console.error('Error fetching gym owner profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👨‍🏫 Add a new trainer
router.post('/trainers', verifyToken, isGymOwner, async (req, res) => {
  try {
    const { name, email, password, phone, specialization } = req.body;

    // Check if trainer with email already exists
    const existingTrainer = await User.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({ message: 'Trainer with this email already exists' });
    }

    const trainer = new Trainer({ 
      name, 
      email, 
      password, 
      phone,
      specialization,
      gymOwner: req.user.id,
      role: 'trainer'
    });
    
    await trainer.save();

    // Don't return password
    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;

    res.status(201).json(trainerResponse);
  } catch (error) {
    console.error('Error adding trainer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👨‍🏫 Get all trainers under this gym
router.get('/trainers', verifyToken, isGymOwner, async (req, res) => {
  try {
    const trainers = await Trainer.find({ gymOwner: req.user.id }).select('-password');
    res.status(200).json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👨‍🏫 Update a trainer
router.put('/trainers/:id', verifyToken, isGymOwner, async (req, res) => {
  try {
    const { name, email, phone, specialization, isActive } = req.body;
    
    // Ensure trainer belongs to this gym owner
    const trainer = await Trainer.findOne({ 
      _id: req.params.id, 
      gymOwner: req.user.id 
    });
    
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found or not authorized' });
    }
    
    // Update fields
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, specialization, isActive },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json(updatedTrainer);
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👨‍🏫 Delete a trainer
router.delete('/trainers/:id', verifyToken, isGymOwner, async (req, res) => {
  try {
    // Ensure trainer belongs to this gym owner
    const trainer = await Trainer.findOne({ 
      _id: req.params.id, 
      gymOwner: req.user.id 
    });
    
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found or not authorized' });
    }
    
    await Trainer.findByIdAndDelete(req.params.id);
    
    // Update members that had this trainer assigned
    await Member.updateMany(
      { trainer: req.params.id },
      { $unset: { trainer: 1 } }
    );
    
    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👤 Add a new member
router.post('/members', verifyToken, isGymOwner, async (req, res) => {
  try {
    const { name, email, password, phone, trainerId, plan, membershipStart, membershipEnd } = req.body;

    // Check if member with email already exists
    const existingMember = await User.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: 'Member with this email already exists' });
    }

    // Verify trainer exists and belongs to this gym if provided
    if (trainerId) {
      const trainer = await Trainer.findOne({ 
        _id: trainerId, 
        gymOwner: req.user.id 
      });
      
      if (!trainer) {
        return res.status(400).json({ message: 'Invalid trainer selected' });
      }
    }

    const member = new Member({ 
      name, 
      email, 
      password,
      phone,
      trainer: trainerId, 
      gymOwner: req.user.id, 
      plan,
      membershipStart: membershipStart || Date.now(),
      membershipEnd,
      role: 'member'
    });
    
    await member.save();

    // Don't return password
    const memberResponse = member.toObject();
    delete memberResponse.password;

    res.status(201).json(memberResponse);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👤 Get all members under this gym
router.get('/members', verifyToken, isGymOwner, async (req, res) => {
  try {
    const members = await Member.find({ gymOwner: req.user.id })
      .populate('trainer', 'name email')
      .select('-password');
      
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👤 Update a member
router.put('/members/:id', verifyToken, isGymOwner, async (req, res) => {
  try {
    const { name, email, phone, trainerId, plan, membershipStart, membershipEnd, isActive } = req.body;
    
    // Ensure member belongs to this gym owner
    const member = await Member.findOne({ 
      _id: req.params.id, 
      gymOwner: req.user.id 
    });
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found or not authorized' });
    }
    
    // Verify trainer exists and belongs to this gym if provided
    if (trainerId) {
      const trainer = await Trainer.findOne({ 
        _id: trainerId, 
        gymOwner: req.user.id 
      });
      
      if (!trainer) {
        return res.status(400).json({ message: 'Invalid trainer selected' });
      }
    }
    
    // Update fields
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, trainer: trainerId, plan, membershipStart, membershipEnd, isActive },
      { new: true, runValidators: true }
    )
      .populate('trainer', 'name email')
      .select('-password');
    
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 👤 Delete a member
router.delete('/members/:id', verifyToken, isGymOwner, async (req, res) => {
  try {
    // Ensure member belongs to this gym owner
    const member = await Member.findOne({ 
      _id: req.params.id, 
      gymOwner: req.user.id 
    });
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found or not authorized' });
    }
    
    await Member.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 📊 Get gym statistics
router.get('/stats', verifyToken, isGymOwner, async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments({ gymOwner: req.user.id });
    const totalTrainers = await Trainer.countDocuments({ gymOwner: req.user.id });
    const activeMembers = await Member.countDocuments({ 
      gymOwner: req.user.id, 
      isActive: true,
      membershipEnd: { $gt: new Date() }
    });
    
    // Get members by plan
    const membersByPlan = await Member.aggregate([
      { $match: { gymOwner: req.user.id } },
      { $group: { _id: "$plan", count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      totalMembers,
      totalTrainers,
      activeMembers,
      membersByPlan
    });
  } catch (error) {
    console.error('Error fetching gym stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 