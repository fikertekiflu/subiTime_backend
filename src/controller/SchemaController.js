const Sponsor = require('../models/SponsorSchema');

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

    const newSponsor = new Sponsor({
      title,
      description,
      youtubeIframe,
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

    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      { title, description, youtubeIframe },
      { new: true }
    );

    if (!updatedSponsor) {
      return res.status(404).json({ message: 'Sponsor not found!' });
    }

    res.status(200).json({ message: 'Sponsor updated successfully!', data: updatedSponsor });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete a sponsor by ID
const deleteSponsor = async (req, res) => {
  try {
    const deletedSponsor = await Sponsor.findByIdAndDelete(req.params.id);

    if (!deletedSponsor) {
      return res.status(404).json({ message: 'Sponsor not found!' });
    }

    res.status(200).json({ message: 'Sponsor deleted successfully!' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = {
  getAllSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
};