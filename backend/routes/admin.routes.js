const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, permitRoles } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// All admin routes require authentication and Super Admin role
router.use(verifyToken);
router.use(checkRole(['superAdmin']));

// Routes for handling gym owner approvals
router.get('/pending-approvals', adminController.getPendingApprovals);
router.put('/approve-owner/:ownerId', adminController.approveGymOwner);
router.delete('/reject-owner/:ownerId', adminController.rejectGymOwner);

module.exports = router; 