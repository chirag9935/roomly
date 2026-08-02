const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { setPreferences, getMyPreferences, getMatches } = require('../controllers/roommate.controller');

router.put('/preferences', protect, setPreferences);
router.get('/preferences', protect, getMyPreferences);
router.get('/matches', protect, getMatches);

module.exports = router;