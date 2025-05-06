const express = require('express');
const {
  getAllSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  getSponsorById, 
} = require('../controller/SchemaController'); 
const upload = require('../middleware/upload'); 

const router = express.Router();

// Routes
router.get('/', getAllSponsors);
router.post('/', upload.single('featuredImage'), createSponsor); 
router.get('/:id', getSponsorById); 
router.put('/:id', upload.single('featuredImage'), updateSponsor); 
router.delete('/:id', deleteSponsor);

module.exports = router;