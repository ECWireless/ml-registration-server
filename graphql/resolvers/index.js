const bcrypt = require('bcryptjs');

// Models
const Form = require('../../models/form');
const User = require('../../models/user');

// Helpers
const forms = async formIds => {
    try {
        const forms = await Form.find({ _id: {$in: formIds }})
        forms.map(form => {
            return {
                ...form._doc,
                creator: user.bind(this, form.creator)
            };
        });
        return forms;
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            createdForms: forms.bind(this, user._doc.createdForm)
        };
    } catch (err) {
        throw err;
    }
	
}

module.exports = {
    users: async () => {
        try {
            const users = await User.find()
            return users.map(user => {
                return { ... user._doc, password: null }
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

            return { ...result._doc, password: null };
        } catch (err) {
            throw err;
        }
    },
    forms: async () => {
        try {
            const forms = await Form.find()
            return forms.map(form => {
                return { ... form._doc, creator: user.bind(this, form._doc.creator) }
            });
        } catch (err) {
            throw err;
        }
    },
    createForm: async args => {
        try {
            const existingForm = await Form.findOne({ name: args.formInput.name })
                
            if (existingForm) {
                throw new Error('Name on this form exists already!');
            }

            const form = await new Form({
                name: args.formInput.name,
                phoneNumber: args.formInput.phoneNumber,
                email: args.formInput.email,
                creator: '5d65ba32c4d3e1a565b3d4e0'
            })

            let createdForm;

            const result = await form
            .save()
            createdForm = {
                ...result._doc,
                creator: user.bind(this, result._doc.creator)
            };

            const creator = await User.findById('5d65ba32c4d3e1a565b3d4e0');

            if (!creator) {
                throw new Error('User not found!');
            }

            creator.createdForm.push(form);

            await creator.save();
            return createdForm;
        } catch (err) {
            throw err;
        }
    }
}