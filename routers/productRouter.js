const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.route('/').get(productController.getProducts).post(productController.createProduct);
router.route('/:id').delete(productController.deleteProduct).put(productController.editProduct)

module.exports = router;