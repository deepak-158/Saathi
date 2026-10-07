const express = require('express');
const { createCheckIn, getCheckIns } = require('../controllers/checkinController');
const { protect } = require('../middleware/authMiddleware');
const { validate, checkInSchema } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', validate(checkInSchema), createCheckIn);
router.get('/', getCheckIns);

module.exports = router;
