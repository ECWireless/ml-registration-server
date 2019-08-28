const bcrypt = require('bcryptjs');

// Models
const Form = require('../../models/form');
const User = require('../../models/user');

// Helpers
const form = async formId => {
    try {
        const foundForm = await Form.findById(formId)
        return {
            ...foundForm._doc,
            creator: user.bind(this, foundForm.creator)
        };
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            createdForm: form.bind(this, user._doc.createdForm)
        };
    } catch (err) {
        throw err;
    }
}

module.exports = {
    users: async () => {
        try {
            const users = await User.find()
            return users.map(queryUser => {
                return {
                    ... queryUser._doc,
                    password: null,
                    createdForm: form.bind(this, queryUser._doc.createdForm)
                }
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
                password: hashedPassword,
                createdForm: null
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
                return {
                    ... form._doc,
                    creator: user.bind(this, form._doc.creator),
                    createdAt: new Date(form._doc.createdAt).toISOString(),
                    updatedAt: new Date(form._doc.updatedAt).toISOString()
                }
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
                creator: '5d66a1d04e63bc196da98f97'
            })

            let createdForm;

            const result = await form
            .save()
            createdForm = {
                ...result._doc,
                creator: user.bind(this, result._doc.creator),
                createdAt: new Date(form._doc.createdAt).toISOString(),
                updatedAt: new Date(form._doc.updatedAt).toISOString()
            };

            const creator = await User.findById('5d66a1d04e63bc196da98f97');

            if (!creator) {
                throw new Error('User not found!');
            }

            creator.createdForm = form;

            await creator.save();
            return createdForm;
        } catch (err) {
            throw err;
        }
    },
    deleteForm: async args => {
        try {
            const form = await Form.findById(args.formId);
            const spreadForms = {
                ...form._doc,
                creator: user.bind(this, form._doc.creator)
            }
            console.log(spreadForms)
            await Form.deleteOne({_id: args.formId});

            return spreadForms;
        } catch (err) {

        }
    }
}