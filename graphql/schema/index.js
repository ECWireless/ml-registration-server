const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        username: String!
        password: String
        createdForm: Form!
    }

    type Form {
        _id: ID!
        name: String!
        phoneNumber: String!
        email: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
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
        createUser(userInput: UserInput): User
        createForm(formInput: FormInput): Form
        deleteForm(formId: ID!): Form
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)