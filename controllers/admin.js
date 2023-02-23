const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false,
    });
};

const postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description  } = req.body;
    const product = new Product(null, title, imageUrl, price, description);
    product.save()
        .then(() => res.redirect('/'));
};

const getEditProduct = (req, res, next) => {
    const { productId } = req.params;
    const { edit } = req.query;
    Product.findById(productId, (product) => {
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

  const updatedProduct = new Product(productId, title, imageUrl, price, description);
  updatedProduct.save();
  res.redirect('/admin/products');
};

const postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.delete(productId);
    res.redirect('/admin/products');
}

const getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows]) => {
            res.render('admin/products', {
                prods: rows,
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
