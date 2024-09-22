const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');

router.post('/', (req, res, next) => {
  console.log('Request received:', req.body); // Log request body
  next();
}, networkController.calculateNetworkSolution);

router.get('/', (req, res) => {
  res.redirect('/'); // Redirect to the desired default page
});

module.exports = router;
