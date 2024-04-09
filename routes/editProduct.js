
var express = require('express');
var router = express.Router();
const queries = require('../database/queries');
const deletethething = require('../database/deleteProduct');
const func = require('../database/isTokenAdmin');

router.get('/', function (req, res, next) {

  // res.render('pages/edit-product');
  return res.status(405).send('Include a product id');
});

router.get('/:productId', (req, res) => {
  productId = req.params.productId;
  token = req.query.session;

  queries.productInfoFromPID(productId, (err, item) => {
    if (err) {
      // console.error(err);
      // return res.status(500).send('An error occurred');
      return next(err);
    }
    if (!item) {
      return res.status(404).send('Product not found');
    }
    if(token == null || token == undefined || token == ""){
      res.send("invalid session token ):");
    }
    func.isTokenAdmin(token, (err, exists, is_admin) => {
      if(!exists){
        res.send("invalid session token ):");
      }
      if(!is_admin){
        res.send("invalid session token - non admin user");
      } else {
        res.render('pages/edit-product', { item: item, productId: productId, token:token, admin : is_admin });

      }
    });

    // Render the view-product.ejs template with the item object
  });

});

router.post('/:id', (req, res) => {

  const {productId, name, price, description, image, quantity} = req.body

  queries.updateProd(name, price, description, image, quantity, productId, (err, result) => {
    if (err) {
      return next(err)
      // return res.status(500).json({ success: false, message: 'Error updating product', error: err.message });
    } else {
      res.json({ success: true, message: 'Product updated successfully', result: result });
    }
  });
});



// Error-handling middleware
router.use((err, req, res, next) => {
  console.error(err); // Log the error information for debugging purposes
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Something went wrong on the server.' : err.message;
  res.status(statusCode).json({ error: message });
});

module.exports = router;