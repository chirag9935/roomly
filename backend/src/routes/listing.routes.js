const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  create, getOne, getMyListings, search, update, remove
} = require('../controllers/listing.controller');

router.get('/search', search);
router.get('/my-listings', protect, authorize('owner'), getMyListings);
router.get('/:id', getOne);
router.post('/', protect, authorize('owner'), create);
router.put('/:id', protect, authorize('owner'), update);
router.delete('/:id', protect, authorize('owner'), remove);

module.exports = router;