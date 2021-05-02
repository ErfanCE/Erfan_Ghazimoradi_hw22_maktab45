const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin-controller');


// admin panel
router.get('/', admin.panel);

router.get('/:username', admin.bloggerArticles);

router.patch('/:username', admin.passwordRecovery);

router.delete('/:username', admin.removeBlogger);

router.delete('/:username/:articleTitle', admin.articleRemove);


module.exports = router;