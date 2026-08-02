const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { validate, validateQuery } = require('../middleware/validate');
const {
  createListingSchema, updateListingSchema, searchListingsQuerySchema
} = require('../validators/listing.schema');
const {
  create, getOne, getMyListings, search, update, remove
} = require('../controllers/listing.controller');

router.get('/search', validateQuery(searchListingsQuerySchema), search);
router.get('/my-listings', protect, authorize('owner'), getMyListings);
router.get('/:id', getOne);
router.post('/', protect, authorize('owner'), validate(createListingSchema), create);
router.put('/:id', protect, authorize('owner'), validate(updateListingSchema), update);
router.delete('/:id', protect, authorize('owner'), remove);

module.exports = router;