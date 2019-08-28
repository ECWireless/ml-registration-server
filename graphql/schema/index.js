const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        username: String!
        password: String
        createdForms: [Form!]
    }

    type Form {
        _id: ID!
        name: String!
        phoneNumber: String!
        email: String!
        creator: User!
    }

    input UserInput {
        username: String!
        password: String!
    }

    input FormInput {
        name: String!
        phoneNumber: String!
        email: String!
    }

    type RootQuery {
        users: [User!]!
        forms: [Form!]!
    }
    type RootMutation {
        createForm(formInput: FormInput): Form
        createUser(userInput: UserInput): User
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)