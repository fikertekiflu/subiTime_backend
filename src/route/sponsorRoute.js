const express = require('express');
const {
  getAllSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} = require('../controller/SchemaController');

const router = express.Router();

// Routes
router.get('/', getAllSponsors); 
router.post('/', createSponsor); 
router.put('/:id', updateSponsor); 
router.delete('/:id', deleteSponsor);

module.exports = router;