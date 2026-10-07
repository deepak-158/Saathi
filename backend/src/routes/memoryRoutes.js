const express = require('express');
const { getMemories, createMemory, updateMemory, deleteMemory } = require('../controllers/memoryController');
const { protect } = require('../middleware/authMiddleware');
const { validate, createMemorySchema, updateMemorySchema } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.get('/', getMemories);
router.post('/', validate(createMemorySchema), createMemory);
router.patch('/:id', validate(updateMemorySchema), updateMemory);
router.delete('/:id', deleteMemory);

module.exports = router;
