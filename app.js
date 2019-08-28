const express = require('express');
const bodyParser = require('body-parser');

const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const app = express();

app.use(bodyParser.json());

app.use('/', graphqlHttp({
	schema: graphQlSchema,
    rootValue: graphQlResolvers,
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