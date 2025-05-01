const cloudinary = require('../config/cloudinary');
const Partner = require('../models/PartnerSchema');
const streamifier = require('streamifier');

// Helper function to upload images to Cloudinary using streams
const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'partners' }, // Specify the Cloudinary folder
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};
// Get all partners
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find();
    res.status(200).json({ message: 'Fetched successfully!', data: partners });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Create a new partner
const createPartner = async (req, res) => {
  try {
    const { title, websiteLink } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Logo is required!' });
    }

    const result = await streamUpload(req);

    const newPartner = new Partner({
      title,
      websiteLink,
      logo: result.secure_url, // Save the Cloudinary image URL
      cloudinary_id: result.public_id, // Save the Cloudinary public ID
    });

    await newPartner.save();
    res.status(201).json({ message: 'Partner created successfully!', data: newPartner });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update a partner by ID
const updatePartner = async (req, res) => {
  try {
    const { title, websiteLink } = req.body;
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found!' });

    let logo = partner.logo;
    let cloudinary_id = partner.cloudinary_id;

    if (req.file) {
      // Delete the previous logo from Cloudinary
      if (cloudinary_id) {
        await cloudinary.uploader.destroy(cloudinary_id);
      }

      // Upload the new logo to Cloudinary
      const result = await streamUpload(req);
      logo = result.secure_url;
      cloudinary_id = result.public_id;
    }

    const updatedPartner = await Partner.findByIdAndUpdate(
      req.params.id,
      { title, websiteLink, logo, cloudinary_id },
      { new: true }
    );

    res.status(200).json({ message: 'Partner updated successfully!', data: updatedPartner });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete a partner by ID
const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found!' });

    // Delete the logo from Cloudinary
    if (partner.cloudinary_id) {
      await cloudinary.uploader.destroy(partner.cloudinary_id);
    }

    await Partner.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Partner deleted successfully!' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner,
};