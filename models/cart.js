const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex((product) => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {
                    ...existingProduct,
                    qty: existingProduct.qty + 1,
                };
                cart.products[existingProductIndex] = updatedProduct;
            }   else {
                updatedProduct = {
                    id,
                    qty: 1,
                }
                cart.products = [...cart.products, updatedProduct];
            }
            const totalPrice = Number(cart.totalPrice);
            cart.totalPrice = totalPrice + Number(price);
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        })
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent);
            const product = cart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            cart.products = cart.products.filter((prod) => prod.id !== id);
            cart.totalPrice = cart.totalPrice - price * product.qty;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = err ? null : JSON.parse(fileContent);
            cb(cart);
        });
    }
}
