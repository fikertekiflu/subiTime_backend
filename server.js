const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
const authRoutes = require('./src/route/authRoute'); 
const articleRoute = require('./src/route/articleRoute'); 
const SponsorRoute = require('./src/route/sponsorRoute');
const PartnerRoute = require('./src/route/partnerRoute');
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/article', articleRoute); 
app.use('/api/sponsor', SponsorRoute);
app.use('/api/partner', PartnerRoute);
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});