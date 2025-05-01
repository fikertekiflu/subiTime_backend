const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['🌍 World', '🏛️ Politics', '📈 Business', '⚽ Sports', '⚕️ Health', '🎭 Entertainment', '🎨 Culture', '🧪 Science & Tech'],
    required: true,
  },
  content: { type: String, required: true },
  description: String,
  youtubeLink: String,
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  publicationDate: { type: Date, default: Date.now },
  featuredImage: String, 
  cloudinary_id: String, 
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);