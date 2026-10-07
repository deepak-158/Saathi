const Goal = require('../models/Goal');
const { asyncHandler, apiResponse } = require('../utils/helpers');

// GET /api/goals
const getGoals = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { userId: req.user._id };
  if (status) query.status = status;

  const goals = await Goal.find(query).sort({ createdAt: -1 }).lean();

  return apiResponse(res, 200, { goals });
});

// POST /api/goals
const createGoal = asyncHandler(async (req, res) => {
  const { title, description, targetDate, tasks = [] } = req.body;

  const goal = await Goal.create({
    userId: req.user._id,
    title,
    description,
    targetDate,
    tasks,
    progress: calculateProgress(tasks),
  });

  return apiResponse(res, 201, { goal }, 'Goal created.');
});

// PATCH /api/goals/:id
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });

  if (!goal) {
    return res.status(404).json({ success: false, message: 'Goal not found.' });
  }

  const { title, description, targetDate, status, tasks } = req.body;
  if (title !== undefined) goal.title = title;
  if (description !== undefined) goal.description = description;
  if (targetDate !== undefined) goal.targetDate = targetDate;
  if (status !== undefined) goal.status = status;
  if (tasks !== undefined) {
    goal.tasks = tasks;
    goal.progress = calculateProgress(tasks);
  }

  await goal.save();
  return apiResponse(res, 200, { goal }, 'Goal updated.');
});

// DELETE /api/goals/:id
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!goal) {
    return res.status(404).json({ success: false, message: 'Goal not found.' });
  }

  return apiResponse(res, 200, null, 'Goal deleted.');
});

function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
