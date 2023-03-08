// const mongodb = require('mongodb');
// // const { getDb } = require('../util/database');
// const ObjectId = mongodb.ObjectId;
//
// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//
//     save() {
//         const db = getDb();
//         return db.collection('users')
//             .insertOne(this)
//     }
//
//     addToCart(product) {
//         const db = getDb();
//         const cartProductIndex = this.cart
//             ? this.cart.items.findIndex((i) => i.productId.toString() === product._id.toString()) : -1;
//         const updatedCartItems = [...this.cart.items];
//
//         if (cartProductIndex >= 0) {
//             updatedCartItems[cartProductIndex].quantity += 1;
//         }   else {
//             updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1, });
//         }
//         const updatedCart = { items: updatedCartItems, };
//         return db.collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             );
//     }
//
//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map((i) => i.productId);
//         return db.collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then((products) => {
//                 return products.map((p) => {
//                     const quantity = this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity;
//                     return { ...p, quantity };
//                 });
//             });
//     }
//
//     deleteItemFromCart(productId) {
//         const db = getDb();
//         const updatedCartItems = this.cart.items
//             .filter((i) => i.productId.toString() !== productId.toString());
//         const updatedCart = { items: updatedCartItems, };
//         return db.collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             );
//     }
//
//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.name,
//                     }
//                 };
//                 return db.collection('orders')
//                     .insertOne(order)
//             })
//             .then(() => {
//                 this.cart = {items: []};
//                 return db.collection('users')
//                     .updateOne(
//                         { _id: new ObjectId(this._id) },
//                         { $set: { cart: this.cart } }
//                     );
//             })
//     }
//
//     getOrders() {
//         const db = getDb();
//         return db.collection('orders')
//             .find({ 'user._id': new ObjectId(this._id) })
//             .toArray();
//     }
//
//     static findById(id) {
//         const db = getDb();
//         return db.collection('users')
//             .findOne({ _id: new ObjectId(id) });
//     }
// }
//
// module.exports = User;
