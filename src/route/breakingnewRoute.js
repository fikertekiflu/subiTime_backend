const express = require('express');
const {
  getAllBreakingNews,
  createBreakingNews,
  updateBreakingNews,
  deleteBreakingNews,
} = require('../controller/breakingnewsController');
const upload = require('../middleware/upload'); // Middleware for handling file uploads

const router = express.Router();

// Routes
router.get('/', getAllBreakingNews); // Get all breaking news
router.post('/', upload.single('image'), createBreakingNews); // Create breaking news
router.put('/:id', upload.single('image'), updateBreakingNews); // Update breaking news by ID
router.delete('/:id', deleteBreakingNews); // Delete breaking news by ID

module.exports = router;