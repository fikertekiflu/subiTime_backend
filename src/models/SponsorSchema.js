const mongoose = require('mongoose');
const SponsorSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    youtubeIframe: { type: String, required: true }, 
    featuredImage: String, 
    cloudinary_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sponsor', SponsorSchema);