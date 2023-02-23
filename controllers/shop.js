const Product = require('../models/product');
const Cart = require('../models/cart');

const getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows]) => {
            res.render('shop/index', {
                prods: rows,
                docTitle: 'Shop',
                path: '/'
            });
        });
};

const getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows]) => {
            res.render('shop/product-list', {
                prods: rows,
                docTitle: 'All Products',
                path: '/products'
            });
        });
};

const getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(([result]) => {
            const product = result[0];
            res.render('shop/product-detail', {
                product,
                docTitle: product.title,
                path: '/products'
            });
        });
};

const getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            for (let product of products) {
                const prod = cart.products.find(prod => prod.id === product.id);
                if (prod) {
                    cartProducts.push({ productData: product, qty: prod.qty });
                }
            }
            res.render('shop/cart', {
                docTitle: 'Cart',
                path: '/cart',
                products: cartProducts,
            });
        });
    });
};

const postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    });
};

const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Orders',
        path: '/orders'
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
    Product.findById(productId, (product) => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getIndex = getIndex;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getCart = getCart;
exports.postCart = postCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;
exports.postDeleteCartItem = postDeleteCartItem;
