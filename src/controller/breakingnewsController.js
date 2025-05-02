const BreakingNews = require('../models/BreakingNewsSchema');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper function to upload images to Cloudinary using streams
const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'breaking-news' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

// Get all breaking news
const getAllBreakingNews = async (req, res) => {
  try {
    const news = await BreakingNews.find();
    res.status(200).json({ message: 'Fetched successfully!', data: news });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Create a new breaking news
const createBreakingNews = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required!' });
    }

    const result = await streamUpload(req);

    const newNews = new BreakingNews({
      title,
      description,
      category,
      image: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await newNews.save();
    res.status(201).json({ message: 'Breaking news created successfully!', data: newNews });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update breaking news by ID
const updateBreakingNews = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const news = await BreakingNews.findById(req.params.id);

    if (!news) return res.status(404).json({ message: 'Breaking news not found!' });

    let image = news.image;
    let cloudinary_id = news.cloudinary_id;

    if (req.file) {
      // Delete the previous image from Cloudinary
      if (cloudinary_id) {
        await cloudinary.uploader.destroy(cloudinary_id);
      }

      // Upload the new image to Cloudinary
      const result = await streamUpload(req);
      image = result.secure_url;
      cloudinary_id = result.public_id;
    }

    const updatedNews = await BreakingNews.findByIdAndUpdate(
      req.params.id,
      { title, description, category, image, cloudinary_id },
      { new: true }
    );

    res.status(200).json({ message: 'Breaking news updated successfully!', data: updatedNews });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete breaking news by ID
const deleteBreakingNews = async (req, res) => {
  try {
    const news = await BreakingNews.findById(req.params.id);

    if (!news) return res.status(404).json({ message: 'Breaking news not found!' });

    // Delete the image from Cloudinary
    if (news.cloudinary_id) {
      await cloudinary.uploader.destroy(news.cloudinary_id);
    }

    await BreakingNews.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Breaking news deleted successfully!' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  getAllBreakingNews,
  createBreakingNews,
  updateBreakingNews,
  deleteBreakingNews,
};