const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID!
        username: String
        email: String
        bookCount: Int
        savedBooks:[Book]
    }

    type Book {
        bookId: ID!
        authors: [""]
        description: String
        title: String
        image: img
        link: String
    }

    type Auth {
        token: String
        user: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        add
    }
`

module.exports = typeDefs;