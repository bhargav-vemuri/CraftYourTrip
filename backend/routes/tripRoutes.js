const express = require('express');
const router = express.Router();
const { generateTrip } = require('../controllers/tripController');
const { validateTripRequest } = require('../validators/tripValidator');

// POST /api/trips/generate
router.post('/generate', validateTripRequest, generateTrip);

module.exports = router;
