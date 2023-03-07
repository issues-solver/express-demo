const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const { mongoConnect } = require('./util/database');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('64034fcf2e5bbf21c9f470d8').then((user) => {
        const { name, email, cart, _id } = user;
        req.user = new User(name, email, cart, _id);
        next();
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getPageNotFound);

mongoConnect(() => {
    app.listen(3000);
});

