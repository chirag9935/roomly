const {
    createListing, getListingById, getListingsByOwner,
    searchListings, updateListing, deleteListing
} = require('../models/listing.model');

async function create(req, res, next) {
    try {
        const {
            title, description, city, area, rent, occupancyType,
            genderPreference, amenities, photoUrls, houseRules
        } = req.body;

        if (!title || !city || !area || rent === undefined || rent === null || !occupancyType) {
            const err = new Error('title, city, area, rent, and occupancyType are required');
            err.statusCode = 400;
            throw err;
        }

        const listing = await createListing({
            ownerId: req.user.id, title, description, city, area, rent,
            occupancyType, genderPreference, amenities, photoUrls, houseRules
        });

        res.status(201).json({ success: true, listing });
    } catch (err) {
        next(err);
    }
}

async function getOne(req, res, next) {
    try {
        const listing = await getListingById(req.params.id);
        if (!listing) {
            const err = new Error('Listing not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, listing });
    } catch (err) {
        next(err);
    }
}

async function getMyListings(req, res, next) {
    try {
        const listings = await getListingsByOwner(req.user.id);
        res.status(200).json({ success: true, listings });
    } catch (err) {
        next(err);
    }
}

async function search(req, res, next) {
    try {
        const { city, minRent, maxRent, genderPreference, occupancyType } = req.query;
        const listings = await searchListings({ city, minRent, maxRent, genderPreference, occupancyType });
        res.status(200).json({ success: true, count: listings.length, listings });
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const updated = await updateListing(req.params.id, req.user.id, req.body);
        if (!updated) {
            const err = new Error('Listing not found or you are not the owner');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, listing: updated });
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const deleted = await deleteListing(req.params.id, req.user.id);
        if (!deleted) {
            const err = new Error('Listing not found or you are not the owner');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ success: true, message: 'Listing deleted' });
    } catch (err) {
        next(err);
    }
}

module.exports = { create, getOne, getMyListings, search, update, remove };