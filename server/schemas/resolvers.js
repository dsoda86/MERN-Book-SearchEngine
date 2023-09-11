const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");

        return userData;
      }
      throw new AuthenticationError("Please log in");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect Username/Password");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect Username/Password");
      }
      const token = signToken(user);

      return { token, user };
    },
    // addUser(username: String!, email: String!, password: String!): Auth
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    // saveBook(input: BookInput): User
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("Please log in");
    },
    // removeBook(bookId: ID!): User
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("Please log in");
    },
  },
};

module.exports = resolvers;