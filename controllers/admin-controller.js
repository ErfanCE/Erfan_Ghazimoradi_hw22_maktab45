const fs = require('fs');
const path = require('path');
const Blogger = require('../models/blogger-model');
const Article = require('../models/article-model');


// admin initialization 
const createAdmin = () => {
    Blogger.findOne({role: 'admin'}, (err, admin) => {
        if (err) return console.log(err.message);

        // check for admin
        if (admin) return console.log('[+] Admin already created.');

        new Blogger({
            firstname: 'Erfan',
            lastname: 'Ghazimoradi',
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            gender: 'male',
            avatar: 'default-avatar.png',
            phoneNumber: process.env.ADMIN_PHONE,
            role: 'admin'
        }).save(err => {
            if (err) return console.log(err.message);

            return console.log('[+] Admin created successfully.');
        });
    });
};

// admin panel
const panel = (request, response, next) => {
    Blogger.find({role: 'blogger'}, (err, bloggers) => {
        if (err) return console.log('admin panel ' + err.message);

        return response.render(path.join(__dirname, '..', 'views', 'admin', 'panel-page.ejs'), {
            blogger: request.session.blogger,
            bloggers
        });
    });
};

// blogger password recovery to phone number
const passwordRecovery = (request, response, next) => {
    Blogger.findOne({username: request.params.username}, (err, blogger) => {
        if (err) return console.log('password recovery(find): ' + err.message);

        // update password
        blogger.password = blogger.phoneNumber;

        blogger.save(err => {
            if (err) return cosole.log('password recovery(save): ' + err.message);

            response.send('recovered');
        });
    });
};

// remove blogger by username
const removeBlogger = (request, response, next) => {
    Blogger.findOneAndDelete({username: request.params.username}, (err, blogger) => {
        if (err) return console.log('remove blogger(admin): ' + err.message);

        Article.deleteMany({blogger: blogger.username}, (err, result) => {
            if (err) return console.log('remove blogger articles: ' + err.message);

            try {
                if (blogger.avatar !== 'default-avatar.png') fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', 'avatars', 'bloggers', blogger.avatar));
                
                fs.rmSync(path.join(__dirname, '..', 'public', 'images', 'articles', blogger.username), {recursive: true});

                return response.send('blogger ' + blogger.username + ' removed successfully.');
            } catch(err) {
                console.log('remove bloggger images: ' + err.message);
            };
        });
    });
};

const bloggerArticles = (request, response, next) => {
    Article.find({blogger: request.params.username}, (err, articles) => {
        if (err) return console.log('admin panel(articles): ' + err.message);

        response.render(path.join(__dirname, '..', 'views', 'admin', 'blogger-articles.ejs'), {articles});
    });
};

const articleRemove = (request, response, next) => {
    Article.findOneAndDelete({blogger: request.params.username, title: request.params.articleTitle}, (err, article) => {
        if (err) return console.log('remove article: ' + err.message);

        if (!article) return response.render(path.join(__dirname, '..', 'views', 'error', '404-page.ejs'));

        fs.unlink(path.join(__dirname, '..', 'public', 'images', 'articles', article.blogger, article.picture), err => {
            if (err) return console.log('unlink picture(remove) ' + err.message);

            return response.send('deleted');
        });
    });
};

// setup directories
const setupDirectories = () => {
    fs.access(path.join(__dirname, '..', 'public', 'images', 'articles'), err => {
        if (err) {
            fs.mkdir(path.join(__dirname, '..', 'public', 'images', 'articles'), err => {
                if (err) return console.log('Create directories ' + err.message);

                return console.log('[+] Directories are created => (articles picture).');
            });
        } else return console.log('[+] Directories are setup => (articles picture).');
    });

    fs.access(path.join(__dirname, '..', 'public', 'images', 'avatars', 'bloggers'), err => {
        if (err) {
            fs.mkdir(path.join(__dirname, '..', 'public', 'images', 'avatars', 'bloggers'), err => {
                if (err) return console.log('create directoies ' + err.message);
                
                return console.log('[+] Directories are created => (bloggers avatar).');
            });
        } else return console.log('[+] Directories are setup => (bloggers avatar).');
    });
};


module.exports = { 
    createAdmin,
    setupDirectories,
    panel,
    removeBlogger,
    passwordRecovery,
    bloggerArticles,
    articleRemove
};