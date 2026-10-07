const Memory = require('../models/Memory');
const { asyncHandler, apiResponse } = require('../utils/helpers');

// GET /api/memories
const getMemories = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = { userId: req.user._id };
  if (category && category !== 'all') {
    query.category = new RegExp(`^${category}$`, 'i');
  }

  const rawMemories = await Memory.find(query)
    .sort({ importance: -1, updatedAt: -1 })
    .lean();

  // Ensure both text and content are available
  const memories = rawMemories.map((m) => ({
    ...m,
    text: m.content,
  }));

  return apiResponse(res, 200, { memories });
});

// POST /api/memories
const createMemory = asyncHandler(async (req, res) => {
  const { category = 'ACADEMICS', content, text, importance = 5 } = req.body;
  const memoryContent = content || text;

  if (!memoryContent) {
    return res.status(400).json({ success: false, message: 'Memory content is required.' });
  }

  const memory = await Memory.create({
    userId: req.user._id,
    category: category.toUpperCase(),
    content: memoryContent,
    importance,
    lastUsedAt: new Date(),
  });

  const responseMemory = {
    ...memory.toObject(),
    text: memory.content,
  };

  return apiResponse(res, 201, { memory: responseMemory }, 'Memory added.');
});

// PATCH /api/memories/:id
const updateMemory = asyncHandler(async (req, res) => {
  const memory = await Memory.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!memory) {
    return res.status(404).json({ success: false, message: 'Memory not found.' });
  }

  const { content, text, category, importance } = req.body;
  const newContent = content !== undefined ? content : text;

  if (newContent !== undefined) memory.content = newContent;
  if (category !== undefined) memory.category = category.toUpperCase();
  if (importance !== undefined) memory.importance = importance;

  await memory.save();

  const responseMemory = {
    ...memory.toObject(),
    text: memory.content,
  };

  return apiResponse(res, 200, { memory: responseMemory }, 'Memory updated.');
});

// DELETE /api/memories/:id
const deleteMemory = asyncHandler(async (req, res) => {
  const memory = await Memory.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!memory) {
    return res.status(404).json({ success: false, message: 'Memory not found.' });
  }

  return apiResponse(res, 200, null, 'Memory forgotten.');
});

module.exports = { getMemories, createMemory, updateMemory, deleteMemory };
