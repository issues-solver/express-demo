const Product = require('../models/product');

const getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'Shop',
                path: '/'
            });
        });
};

const getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                docTitle: 'All Products',
                path: '/products'
            });
        });
};

const getProduct = (req, res, next) => {
    const productId = req.params.productId;
    console.log(productId);
    Product.findById(productId)
        .then((product) => {
            res.render('shop/product-detail', {
                product,
                docTitle: product.title,
                path: '/products'
            });
        })
        .catch((err) => console.log(err));
};

const getCart = (req, res, next) => {
    req.user.getCart()
        .then((products) => {
            res.render('shop/cart', {
                docTitle: 'Cart',
                path: '/cart',
                products,
            });
        });
};

const postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId)
        .then((product) => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
};

const getOrders = (req, res, next) => {
    req.user.getOrders()
        .then((orders) => {
            res.render('shop/orders', {
                docTitle: 'Orders',
                path: '/orders',
                orders,
            });
        });
};

const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
}

const postDeleteCartItem = (req, res, next) => {
    const { productId } = req.body;
    req.user.deleteItemFromCart(productId)
        .then(() => res.redirect('/cart'))
};

const postOrder = (req, res, next) => {
    req.user.addOrder()
        .then(() => res.redirect('/orders'));
};

exports.getIndex = getIndex;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getCart = getCart;
exports.postCart = postCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;
exports.postDeleteCartItem = postDeleteCartItem;
exports.postOrder = postOrder;
