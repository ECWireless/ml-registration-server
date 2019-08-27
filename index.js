const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const { buildSchema } = require('graphql');
const graphqlHttp = require('express-graphql');


app.use(bodyParser.json());


// Arrays

let forms = [];

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Form {
            _id: ID!
            name: String!
            phoneNumber: String!
            email: String!
        }

        input FormInput {
            name: String!
            phoneNumber: String!
            email: String!
        }

        type RootQuery {
            users: [String!]
            forms: [Form!]!
        }
        type RootMutation {
            createForm(formInput: FormInput): Form
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        forms: () => {
            return forms;
        },
        createForm: (args) => {
            const form = {
                _id: Math.random().toString(),
                name: args.formInput.name,
                phoneNumber: args.formInput.phoneNumber,
                email: args.formInput.email
            }
            forms.push(form);
            console.log(forms)
            return form;
        }
    },
    graphiql: true
}));