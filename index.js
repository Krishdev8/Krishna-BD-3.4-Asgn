const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.use(express.static('static'));

let cart = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 },
];

function addNewItemToCart(productId, name, price, quantity) {
  cart.push({
    productId: productId,
    name: name,
    price: price,
    quantity: quantity,
  });
  return cart;
}
app.get('/cart/add', (req, res) => {
  let productId = parseInt(req.query.productId);
  let name = req.query.name;
  let price = parseFloat(req.query.price);
  let quantity = parseInt(req.query.quantity);
  let result = addNewItemToCart(productId, name, price, quantity);
  res.json({ cartItems: result });
});

//2 Edit Quantity of an Item in the Cart
function updateQuantityOfItemInCart(cart, productId, quantity) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId === productId) {
      cart[i].quantity = quantity;
      break;
    }
  }
  return cart;
}

app.get('/cart/edit', (req, res) => {
  let quantity = parseInt(req.query.quantity);
  let productId = parseInt(req.query.productId);
  let result = updateQuantityOfItemInCart(cart, productId, quantity);
  cart = result;
  res.json({ cartItems: result });
});

//3 Delete an Item from the Cart
function removeAnItemFromCartByProductId(cart, productId) {
  return cart.filter((cartItem) => cartItem.productId != productId);
}

app.get('/cart/delete', (req, res) => {
  let productId = parseInt(req.query.productId);
  let result = removeAnItemFromCartByProductId(cart, productId);
  res.json({ cartItems: result });
});

//4 Read Items in the Cart

app.get('/cart', (req, res) => {
  res.json({ cartItems: cart });
});

//5 Calculate Total Quantity of Items in the Cart

function calculateTotalQuanityOfItemsInCart(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].quantity;
  }
  return total;
}

app.get('/cart/total-quantity', (req, res) => {
  let result = calculateTotalQuanityOfItemsInCart(cart);
  res.json({ totalQuantity: result });
});

//6 Calculate Total Price of Items in the Cart

function calculateTotalPriceOfItemsInCart(cart) {
  let totalPrice = 0;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].quantity === 1) {
      totalPrice = totalPrice + cart[i].price;
    } else if(cart[i].quantity > 1){
      totalPrice = totalPrice + cart[i].price * cart[i].quantity;
    }else{
      return 0;
    }
  }
  return totalPrice;
}

app.get('/cart/total-price', (req, res) => {
  let result = calculateTotalPriceOfItemsInCart(cart);
  res.json({ totalPrice: result });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
