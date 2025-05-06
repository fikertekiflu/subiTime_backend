const cloudinary = require('../config/cloudinary');
const Article = require('../models/ArticleSchema');
const streamifier = require('streamifier');

// Helper function to upload images to Cloudinary using streams
const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'articles' }, 
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json({ message: 'Fetched successfully!', data: articles });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Create a new article
const createArticle = async (req, res) => {
  try {
    const { title, category, content, description, youtubeLink, status } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required!' });
    }

    const result = await streamUpload(req);

    const newArticle = new Article({
      title,
      category,
      content,
      description,
      youtubeLink,
      status,
      featuredImage: result.secure_url, // Save the Cloudinary image URL
      cloudinary_id: result.public_id, // Save the Cloudinary public ID
    });

    await newArticle.save();
    res.status(201).json({ message: 'Created successfully!', data: newArticle });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update an article by ID
const updateArticle = async (req, res) => {
  try {
    const { title, category, content, description, youtubeLink, status } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found!' });

    let featuredImage = article.featuredImage;
    let cloudinary_id = article.cloudinary_id;

    if (req.file) {
      // Delete the previous image from Cloudinary
      if (cloudinary_id) {
        await cloudinary.uploader.destroy(cloudinary_id);
      }

      // Upload the new image to Cloudinary
      const result = await streamUpload(req);
      featuredImage = result.secure_url;
      cloudinary_id = result.public_id;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { title, category, content, description, youtubeLink, status, featuredImage, cloudinary_id },
      { new: true }
    );

    res.status(200).json({ message: 'Updated successfully!', data: updatedArticle });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an article by ID
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found!' });

    // Delete the image from Cloudinary
    if (article.cloudinary_id) {
      await cloudinary.uploader.destroy(article.cloudinary_id);
    }

    await Article.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Deleted successfully!' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found!' });
    }
    res.status(200).json({ message: 'Fetched successfully!', data: article });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Export all functions
module.exports = {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleById,
};