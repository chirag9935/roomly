const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate');
const { createInquirySchema, updateInquiryStatusSchema } = require('../validators/inquiry.schema');
const { create, getForOwner, getMine, updateStatus } = require('../controllers/inquiry.controller');

router.post('/', protect, authorize('seeker'), validate(createInquirySchema), create);
router.get('/received', protect, authorize('owner'), getForOwner);
router.get('/sent', protect, authorize('seeker'), getMine);
router.put('/:id/status', protect, authorize('owner'), validate(updateInquiryStatusSchema), updateStatus);

module.exports = router;