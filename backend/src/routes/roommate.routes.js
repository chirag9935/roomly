const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate');
const { setPreferencesSchema } = require('../validators/roommate.schema');
const { setPreferences, getMyPreferences, getMatches } = require('../controllers/roommate.controller');

router.put('/preferences', protect, validate(setPreferencesSchema), setPreferences);
router.get('/preferences', protect, getMyPreferences);
router.get('/matches', protect, getMatches);

module.exports = router;