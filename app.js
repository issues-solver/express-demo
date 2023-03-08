const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

// const User = require('./models/user');

const app = express();

const getMongoDbUrl = (
    userName = 'sergejprovalinskij',
    password = 'qwerty597',
    databaseName = 'nodejs-shop'
) => `mongodb+srv://${userName}:${password}@cluster0.omwdai9.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//
// app.use((req, res, next) => {
//     User.findById('64034fcf2e5bbf21c9f470d8').then((user) => {
//         const { name, email, cart, _id } = user;
//         req.user = new User(name, email, cart, _id);
//         next();
//     });
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getPageNotFound);

mongoose.connect(getMongoDbUrl())
    .then(() => app.listen(4200));
