const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
       type: String,
       required: true,
   },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
        const cartProductIndex = this.cart.items
            .findIndex((i) => i.productId.toString() === product._id.toString());
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            updatedCartItems[cartProductIndex].quantity += 1;
        }   else {
            updatedCartItems.push({ productId: product._id, quantity: 1, });
        }
        this.cart = { items: updatedCartItems, };
        return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
        const updatedCartItems = this.cart.items
            .filter((i) => i.productId.toString() !== productId.toString());
        this.cart = { items: updatedCartItems };
        return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

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
//
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
