// Models
const User = require('../../models/user');

// Merge
const { transformUser } = require('./merge');

// Encryption
const bcrypt = require('bcryptjs');


module.exports = {
    users: async () => {
        try {
            const users = await User.find()
            return users.map(queryUser => {
                return transformUser(queryUser);
            });
        } catch (err) {
            throw err;
        }
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ username: args.userInput.username })
            
            if (existingUser) {
                throw new Error('User exists already!');
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                username: args.userInput.username,
                password: hashedPassword
            });
            
            const result = await user.save();

            return transformUser(result);
        } catch (err) {
            throw err;
        }
    }
}