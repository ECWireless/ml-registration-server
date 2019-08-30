// Models
const Form = require('../../models/form');
const User = require('../../models/user');

// Merge
const { transformForm } = require('./merge');

module.exports = {
    forms: async (req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }
            const forms = await Form.find()
            return forms.map(form => {
                return transformForm(form);
            });
        } catch (err) {
            throw err;
        }
    },
    createForm: async (args, req) => {
        try {
            // if (!req.isAuth) {
            //     throw new Error('Unauthenticated!');
            // }

            const existingForm = await Form.findOne({ name: args.formInput.name })
                
            if (existingForm) {
                throw new Error('Name on this form exists already!');
            }

            const form = await new Form({
                name: args.formInput.name,
                phoneNumber: args.formInput.phoneNumber,
                email: args.formInput.email,
                creator: args.formInput.creator
            })

            let createdForm;

            const result = await form.save()

            createdForm = transformForm(result);

            const creator = await User.findById(args.formInput.creator);

            if (!creator) {
                throw new Error('User not found!');
            }

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