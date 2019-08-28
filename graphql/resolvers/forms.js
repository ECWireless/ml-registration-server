// Models
const Form = require('../../models/form');
const User = require('../../models/user');

// Merge
const { transformForm } = require('./merge');

module.exports = {
    forms: async (req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        try {
            const forms = await Form.find()
            return forms.map(form => {
                return transformForm(form);
            });
        } catch (err) {
            throw err;
        }
    },
    createForm: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

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

            const result = await form.save()
            createdForm = transformForm(result);

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
    deleteForm: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        
        try {
            const form = await Form.findById(args.formId);
            const spreadForms = transformForm(form);
            await Form.deleteOne({_id: args.formId});

            return spreadForms;
        } catch (err) {

        }
    }
}