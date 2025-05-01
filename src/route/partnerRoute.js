const express = require('express');
const {
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner,
} = require('../controller/partnerController');
const upload = require('../middleware/upload');

const router = express.Router();
router.get('/', getAllPartners); 
router.post('/', upload.single('logo'), createPartner); 
router.put('/:id', upload.single('logo'), updatePartner); 
router.delete('/:id', deletePartner); 

module.exports = router;