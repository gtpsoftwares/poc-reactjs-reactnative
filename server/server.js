const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

let todos = [
  {
    id: Date.now().toString(),
    text: 'abcd',
	productname:'watch',
	producttype : 10,
	productcategory : "Mens",
	productsubcategory : "Titan",
    completed: true,
  },
];

const typeDefs = gql`
  type Todo {
    id: String
    text: String
	productname : String
	producttype : String
	productcategory : String
	productsubcategory :String
    completed: Boolean
  }
  type Query {
    todos: [Todo]!
  }
  type Mutation {
    createTodo(text: String!,productname: String!,producttype : String!,productcategory:String!,productsubcategory:String!):String
    removeTodo(id: String!):String
    updateTodo(id: String!,text: String!,productname: String!,producttype : String!,productcategory:String!,productsubcategory:String!):String
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    createTodo: (parent, args, context, info) => {

      return todos.push({
        id: Date.now().toString(),
        text: args.text,
		productname: args.productname,
		producttype:args.producttype,
		productcategory:args.productcategory,
		productsubcategory:args.productsubcategory,
        completed: false,
      });
    },
    removeTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos.splice(i, 1);
        }
      }
      return args.id;
    },
    updateTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
			
			todos[i].text = args.text;
			todos[i].productname = args.productname;
			todos[i].producttype = args.producttype;
			todos[i].productcategory = args.productcategory;
			todos[i].productsubcategory = args.productsubcategory;
        }
      }
      return args.id;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.use(cors());

app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);