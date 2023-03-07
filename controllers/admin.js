const mongodb = require('mongodb');
const Product = require("../models/product");

const ObjectId = mongodb.ObjectId;

const getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false,
    });
};

const postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description  } = req.body;
    const product = new Product(title, imageUrl, price, description, null, req.user._id);
    product.save()
        .then(() => res.redirect('/admin/products'));
    // Product.create({ title, imageUrl, price, description, userId: req.user.id })
    // req.user.createProduct({ title, imageUrl, price, description })
    //     .then(() => res.redirect('/admin/products'));
};

const getEditProduct = (req, res, next) => {
    const { productId } = req.params;
    const { edit } = req.query;
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: 'Edit Product',
                path: '/admin/edit-product',
                product,
                edit,
            });
        });
};

const postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;
    const product = new Product(
        title,
        imageUrl,
        price,
        description,
        productId);
    return product.save()
        .then(() => res.redirect('/admin/products'));
};

const postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.delete(productId)
        .then(() => res.redirect('/admin/products'));
}

const getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                docTitle: 'Admin Products',
                path: '/admin/products'
            });
        });
};

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getEditProduct = getEditProduct;
exports.getProducts = getProducts;
exports.postEditProduct = postEditProduct;
exports.postDeleteProduct = postDeleteProduct;
