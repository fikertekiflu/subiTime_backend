const Sponsor = require('../models/SponsorSchema');
const cloudinary = require('../config/cloudinary'); // Assuming you have this file configured
const streamifier = require('streamifier');

// Helper function to upload images to Cloudinary using streams
const streamUpload = (req, folderName = 'sponsors') => { // Added folderName parameter with default
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName }, 
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

// Get all sponsors
const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.status(200).json({ message: 'Fetched successfully!', data: sponsors });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Create a new sponsor
const createSponsor = async (req, res) => {
  try {
    const { title, description, youtubeIframe } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Featured image is required!' });
    }

    const result = await streamUpload(req, 'sponsors'); // Pass 'sponsors' or your desired folder
    const newSponsor = new Sponsor({
      title,
      description,
      youtubeIframe,
      featuredImage: result.secure_url, // Save the Cloudinary image URL
      cloudinary_id: result.public_id,   // Save the Cloudinary public ID
    });

    await newSponsor.save();
    res.status(201).json({ message: 'Sponsor created successfully!', data: newSponsor });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update a sponsor by ID
const updateSponsor = async (req, res) => {
  try {
    const { title, description, youtubeIframe } = req.body;
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found!' });
    }

    let featuredImage = sponsor.featuredImage;
    let cloudinary_id = sponsor.cloudinary_id;

    if (req.file) {
      // Delete the previous image from Cloudinary if it exists
      if (cloudinary_id) {
        try {
            await cloudinary.uploader.destroy(cloudinary_id);
        } catch (cloudinaryError) {
            // Log the error but continue, as the main goal is to update the sponsor
            console.error('Cloudinary delete error during update:', cloudinaryError);
        }
      }

      // Upload the new image to Cloudinary
      const result = await streamUpload(req, 'sponsors'); // Pass 'sponsors' or your desired folder
      featuredImage = result.secure_url;
      cloudinary_id = result.public_id;
    }

    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        youtubeIframe,
        featuredImage,
        cloudinary_id,
      },
      { new: true } // Returns the updated document
    );

    res.status(200).json({ message: 'Sponsor updated successfully!', data: updatedSponsor });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete a sponsor by ID
const deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found!' });
    }

    // Delete the image from Cloudinary if it exists
    if (sponsor.cloudinary_id) {
        try {
            await cloudinary.uploader.destroy(sponsor.cloudinary_id);
        } catch (cloudinaryError) {
            // Log the error but proceed to delete from DB
            console.error('Cloudinary delete error:', cloudinaryError);
            // Optionally, you might want to reconsider if deletion should fail if Cloudinary op fails
        }
    }

    await Sponsor.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Sponsor deleted successfully!' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get a single sponsor by ID (Optional, but good practice)
const getSponsorById = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found!' });
    }
    res.status(200).json({ message: 'Fetched successfully!', data: sponsor });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


module.exports = {
  getAllSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  getSponsorById, 
}