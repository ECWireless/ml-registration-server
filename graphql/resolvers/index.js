const authResolver = require('./auth');
const usersResolver = require('./users');
const formsResolver = require('./forms');

const rootResolver = {
    ...authResolver,
    ...usersResolver,
    ...formsResolver
}

module.exports = rootResolver;