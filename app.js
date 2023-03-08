const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const User = require('./models/user');

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

app.use((req, res, next) => {
    User.findById('6408611e14027852a180c270').then((user) => {
        req.user = user;
        next();
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getPageNotFound);

mongoose.connect(getMongoDbUrl())
    .then(() => User.findOne())
    .then((user) => {
        if (!user) {
            const user = new User({
                name: 'Siarhei',
                email: 'test@mail.com',
                cart: {
                    items: []
                }
            });
            return user.save();
        }
        return user;
    })
    .then(() => app.listen(4200));
