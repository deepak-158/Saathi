const express = require('express');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const { validate, createGoalSchema, updateGoalSchema } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.get('/', getGoals);
router.post('/', validate(createGoalSchema), createGoal);
router.patch('/:id', validate(updateGoalSchema), updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
