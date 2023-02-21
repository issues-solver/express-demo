const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const Cart = require('./cart');

const filePath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(filePath, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingIndex = products.findIndex((prod) => prod.id === this.id);
                products[existingIndex] = this;
            }   else {
                this.id = Math.random().toString();
                products.push(this);
            }
            fs.writeFile(
                filePath,
                JSON.stringify(products),
                (err) => {}
            );
        });
    }

    static delete(productId) {
        getProductsFromFile((products) => {
            const updatedProducts = products.filter((prod) => prod.id !== productId);
            const product = products.find((prod) => prod.id === productId);
            fs.writeFile(
                filePath,
                JSON.stringify(updatedProducts),
                (err) => {
                    if (!err) {
                        Cart.deleteProduct(productId, product.price);
                    }
                }
            );
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((p) => p.id === id);
            cb(product);
        });
    }
}
