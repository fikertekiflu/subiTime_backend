const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    websiteLink: { type: String, required: true },
    logo: { type: String, required: true }, // URL for the partner's logo
    cloudinary_id: { type: String, required: true }, // Cloudinary public ID for the logo
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', PartnerSchema);