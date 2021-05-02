const fs = require('fs');
const path = require('path');
const Blogger = require('../models/blogger-model');
const Article = require('../models/article-model');


// render profile page
const profile = (request, response, next) => {
    Blogger.findById(request.session.blogger._id, (err, blogger) => {
        if (err) return console.log(err.message);

        response.render(path.join(__dirname, '../', 'views', 'account', 'profile-page.ejs'), { blogger });
    });
};

// update blogger profile
const edit = (request, response, next) => {
    Blogger.findByIdAndUpdate(request.session.blogger._id, request.body, {new: true}, (err, blogger) => {
        if (err) return console.log(err.message);

        // update session
        request.session.blogger = blogger;
        
        return response.send('updated');
    });
};


// ! papulate
// delete blogger account
const remove = (request, response, next) => {
    Blogger.findByIdAndDelete(request.session.blogger._id, (err, blogger) => {
        if (err) return console.log('remove(account): ' + err.message);

        Article.deleteMany({blogger: blogger.username}, (err, result) => {
            if (err) return console.log('remove blogger articles: ' + err.message);

            try {
                if (blogger.avatar !== 'default-avatar.png') fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', 'avatars', 'bloggers', blogger.avatar));
                
                fs.rmSync(path.join(__dirname, '..', 'public', 'images', 'articles', blogger.username), {recursive: true});

                response.clearCookie('user_sid');
                return response.send('deleted');
            } catch(err) {
                console.log('remove bloggger images: ' + err.message);
            };
        });
    });
};


module.exports = { profile, edit, remove };