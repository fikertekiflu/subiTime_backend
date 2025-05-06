const express = require('express');
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require('../controller/articleController');
const upload = require('../middleware/upload');

const router = express.Router();

// Routes
router.post('/', upload.single('featuredImage'), createArticle);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.put('/:id', upload.single('featuredImage'), updateArticle);
router.delete('/:id', deleteArticle);
module.exports = router;