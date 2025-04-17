// Add this with other route imports
const superAdminRoutes = require('./routes/superAdmin');
const gymOwnerRoutes = require('./routes/gymOwner');
const trainerRoutes = require('./routes/trainer');

// Add this with other route declarations 
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/gym-owner', gymOwnerRoutes);
app.use('/api/trainer', trainerRoutes); 