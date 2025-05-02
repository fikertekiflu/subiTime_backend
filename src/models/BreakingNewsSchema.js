const mongoose = require('mongoose');

const BreakingNewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        '🌍 World',
        '🏛️ Politics',
        '📈 Business',
        '⚽ Sports',
        '⚕️ Health',
        '🎭 Entertainment',
        '🎨 Culture',
        '🧪 Science & Tech',
      ],
      required: true,
    },
    image: { type: String, required: true }, // Cloudinary image URL
    cloudinary_id: { type: String, required: true }, // Cloudinary public ID
  },
  { timestamps: true }
);

module.exports = mongoose.model('BreakingNews', BreakingNewsSchema);