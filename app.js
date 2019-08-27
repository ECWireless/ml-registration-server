const express = require('express');
const bodyParser = require('body-parser');

const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const Form = require('./models/form');
const User = require('./models/user');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Visit '/graphql'");
});

app.use('/graphql', graphqlHttp({
	schema: buildSchema(`
		type User {
			_id: ID!
			username: String!
			password: String
		}

        type Form {
            _id: ID!
            name: String!
            phoneNumber: String!
            email: String!
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
    `),
    rootValue: {
        users: () => {
			return ['Keith Parish', 'Joe Leachko'];
		},
		createUser: args => {
			return bcrypt
				.hash(args.userInput.password, 12)
				.then(hashedPassword => {
					const user = new User({
						username: args.userInput.username,
						password: hashedPassword
					});
					return user.save();
				})
				.then(result => {
					return { ...result._doc };
				})
				.catch(err => {
					throw err;
				});
		},
        forms: () => {
			return Form.find()
				.then(forms => {
					return forms.map(form => {
						return { ... form._doc }
					});
				})
				.catch(err => {
					throw err;
				})
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
	mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}R@registration-details-kfatx.gcp.mongodb.net/ml-registration?retryWrites=true&w=majority
`)
.then(() => {
	app.listen(port);
})
.catch(err => {
	console.log(err);
})