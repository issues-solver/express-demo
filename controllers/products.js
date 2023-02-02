const Product = require('../models/product');

const getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', {
            prods: products,
            docTitle: 'Shop',
            path: '/'
        });
    });
}

const getAddProduct = (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

const postAddProduct = (req, res, next) => {
    const { title } = req.body;
    const product = new Product(title);
    product.save();
    res.redirect('/');
};

exports.getAddProduct = getAddProduct;
exports.getProducts = getProducts;
exports.postAddProduct = postAddProduct;
