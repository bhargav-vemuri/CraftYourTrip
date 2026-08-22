const express = require('express');
const router = express.Router();
const { generateTrip, handleOptimizeDay, handleReplaceStop } = require('../controllers/tripController');
const { validateTripRequest } = require('../validators/tripValidator');

// POST /api/trips/generate
router.post('/generate', validateTripRequest, generateTrip);

// POST /api/trips/optimize
router.post('/optimize', handleOptimizeDay);

// POST /api/trips/replace
router.post('/replace', handleReplaceStop);

module.exports = router;
