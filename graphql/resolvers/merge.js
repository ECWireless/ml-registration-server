// Models
const User = require('../../models/user');
const Form = require('../../models/form');

// Imported Helpers
const { dateToString } = require('../../helpers/date');

// Helpers
const form = async formId => {
    try {
        const foundForm = await Form.findById(formId)
        return transformForm(foundForm);
    } catch (err) {
        throw err;
    }
}

const transformUser = user => {
    return {
        ...user._doc,
        password: null,
        createdForm: form.bind(this, user._doc.createdForm)
    }
}

const transformForm = form => {
    return {
        ... form._doc,
        creator: user.bind(this, form._doc.creator),
        createdAt: dateToString(form._doc.createdAt),
        updatedAt: dateToString(form._doc.updatedAt)
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return transformUser(user);
    } catch (err) {
        throw err;
    }
}

exports.transformUser = transformUser;
exports.transformForm = transformForm;