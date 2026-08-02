const { upsertPreferences, getPreferencesByUser, findMatches } = require('../models/roommate.model');

async function setPreferences(req, res, next) {
  try {
    const {
      budgetMin, budgetMax, preferredCity, sleepSchedule, foodHabit, cleanlinessLevel, bio
    } = req.body;

    const missingBudget = budgetMin === undefined || budgetMin === null || budgetMax === undefined || budgetMax === null;
    if (missingBudget || !preferredCity || !sleepSchedule) {
      const err = new Error('budgetMin, budgetMax, preferredCity, and sleepSchedule are required');
      err.statusCode = 400;
      throw err;
    }

    if (budgetMin > budgetMax) {
      const err = new Error('budgetMin cannot be greater than budgetMax');
      err.statusCode = 400;
      throw err;
    }

    const prefs = await upsertPreferences(req.user.id, {
      budgetMin, budgetMax, preferredCity, sleepSchedule, foodHabit, cleanlinessLevel, bio
    });

    res.status(200).json({ success: true, preferences: prefs });
  } catch (err) {
    next(err);
  }
}

async function getMyPreferences(req, res, next) {
  try {
    const prefs = await getPreferencesByUser(req.user.id);
    if (!prefs) {
      const err = new Error('No preferences set yet');
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ success: true, preferences: prefs });
  } catch (err) {
    next(err);
  }
}

async function getMatches(req, res, next) {
  try {
    const matches = await findMatches(req.user.id);
    res.status(200).json({ success: true, count: matches.length, matches });
  } catch (err) {
    next(err);
  }
}

module.exports = { setPreferences, getMyPreferences, getMatches };