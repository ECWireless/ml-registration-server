const functions = require('firebase-functions');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            users: [String!]
            forms: [String!]
        }
        type RootMutation {
            createUser(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        users: () => {
            return ['Joe Leachko', 'Keith Parish']
        },
        forms: () => {
            return ['Joe Leachko Form', 'Keith Parish Form']
        },
        createUser: (args) => {
            const userName = args.name;
            return userName;
        }
    },
    graphiql: true
}));

exports.api = functions.https.onRequest(app);