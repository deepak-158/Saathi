const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { validate, updateProfileSchema } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.patch('/', validate(updateProfileSchema), updateProfile);

module.exports = router;
