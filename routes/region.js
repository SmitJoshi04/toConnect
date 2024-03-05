const express = require('express');
const { getCountries, getStates, getCities } = require('../controllers/region');
const router = express.Router();

router.post('/countries',getCountries);
router.post('/states',getStates);
router.post('/cities',getCities);

module.exports = router;