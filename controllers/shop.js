const Product = require('../models/product');

const getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'Shop',
                path: '/'
            });
        });
};

const getProducts = (req, res, next) => {
    Product.findAll()
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
    Product.findByPk(productId)
        .then((product) => {
            res.render('shop/product-detail', {
                product,
                docTitle: product.title,
                path: '/products'
            });
        });
};

const getCart = (req, res, next) => {
    req.user.getCart()
        .then((cart) => cart.getProducts())
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
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then((products) => {
            const product = products[0] || null;
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId);
        })
        .then((product) => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => res.redirect('/cart'));
};

const getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
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
    req.user.getCart()
        .then((cart) => cart.getProducts({ where: { id: productId} }))
        .then((products) => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => res.redirect('/cart'))
};

const postOrder = (req, res, next) => {
    let fetchedCart;
    let fetchedProducts;
    req.user.getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            fetchedProducts = products;
            return req.user.createOrder();
        })
        .then((order) => {
            return order.addProducts(fetchedProducts.map((p) => ({ ...p, orderItem: { quantity: p.cartItem.quantity  } })))
        })
        .then(() => fetchedCart.setProducts(null))
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
