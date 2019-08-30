// Models
const User = require('../../models/user');

// Merge
const { transformUser } = require('./merge');

module.exports = {
    users: async (req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        // }

        try {
            const users = await User.find()
            return users.map(queryUser => {
                return transformUser(queryUser);
            });
        } catch (err) {
            throw err;
        }
    },
}