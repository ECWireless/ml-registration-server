// Models
const User = require('../../models/user');

// Merge
const { transformUser } = require('./merge');

// Password Encryption and Token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
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
    },
    login: async ({ username, password }) => {
        const user = await User.findOne({username: username});
        if (!user) {
            throw new Error('User does not exist!');
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }

        const token = jwt.sign({userId: user.id, username: user.username}, 'Elkey5819', {
            expiresIn: '1h'
        });

        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}