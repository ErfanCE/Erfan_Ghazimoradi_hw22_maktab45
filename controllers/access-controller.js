// admin access control
const admin = (request, response, next) => {
    if (request.session.blogger.role === 'admin') return next();

    return response.status(403).send('access denied');
};


module.exports = { admin };