const mongodb = require('mongodb');
const { getDb } = require('../util/database');

const ObjectId = mongodb.ObjectId;

class Product {
    constructor(title, imageUrl, price, description, id, userId) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this._id = id ? new ObjectId(id): null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products')
                .updateOne(
                    { _id: this._id },
                    { $set: this }
                );
        }   else {
            dbOp = db.collection('products')
                .insertOne(this)
        }
        return dbOp
    }

    static delete(id) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new ObjectId(id) });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new ObjectId(id) }).next();
    }
}

module.exports = Product;
