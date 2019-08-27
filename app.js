const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

// Models
const Form = require('./models/form');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Visit '/graphql'");
});

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
        users: () => {
			return ['Keith Parish', 'Joe Leachko'];
		},
        forms: () => {
            return forms;
        },
        createForm: (args) => {
			const form = new Form({
				name: args.formInput.name,
                phoneNumber: args.formInput.phoneNumber,
                email: args.formInput.email
			})
			
			return form
				.save()
				.then(result =>{
					console.log(result);
					return {...result._doc};
				})
				.catch(err => {
					console.log(err);
					throw err;
				});
        }
    },
    graphiql: true
}));

mongoose.connect(`
	mongodb+srv://Elliott:m5AXhU819PZZCKiR@registration-details-kfatx.gcp.mongodb.net/ml-registration?retryWrites=true&w=majority
`)
.then(() => {
	app.listen(port);
})
.catch(err => {
	console.log(err);
})