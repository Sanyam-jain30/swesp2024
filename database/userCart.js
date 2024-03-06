
const queries = require('../database/queries');

function getUserCart(user_id, callback) {
  queries.cartItemsbyUID(user_id, (err,cartItems) => {
    if (err) {
      return callback(err);
    }

    if (cartItems.length === 0) {
      // Handle empty cart scenario
      return callback(null, []);
    }

    let items = [];
    let completedRequests = 0;
    let hasErrorOccurred = false;

    cartItems.forEach((item, index) => {
      queries.productInfoFromPID(item.product_id, (err, value) => {
        if (hasErrorOccurred) {
          return;
        }

        if (err) {
          hasErrorOccurred = true;
          return callback(err);
        }
        value.quantity = item.quantity;

        items[index] = value; // Use index to maintain order
        completedRequests++;

        if (completedRequests === cartItems.length) {
          // All requests have completed successfully
          console.log(items);
          callback(null, items);
        }
      });
    });
  });
}

module.exports = { getUserCart }