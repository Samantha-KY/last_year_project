const express = require('express');
// const fileUpload = require('express-fileupload');
const router = express.Router();
const {getAllMembers, createNewMember, updateMember, deleteMember, findMemberById} = require('../controllers/member.controller');

// const {uploadImage} = require('../middleware/upload');
// const Product = require('../Models/Product.model');

//get all products
router.get('/', getAllMembers);
// get all in cart
// router.get('/add-to-cart', getAllProductsInCart);
//create product
router.post('/register', createNewMember);
//add to cart
// router.post('/add-to-cart',addToCart);
//get product by id
router.get('/:id',findMemberById);
//update product by id
router.patch('/:id', updateMember);
//delete product by id
router.delete('/:id', deleteMember);
//upload
// router.post('/upload', ProductController.uploadImage);
module.exports = router;