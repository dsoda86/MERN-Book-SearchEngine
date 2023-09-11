const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        console.log(context.user)
        if (context.user) {
          const user = await User.findOne({ _id: context.user._id });
          console.log(user)
          return user
        }
        throw new AuthenticationError("Please log in");
      },
    },
  
    Mutation: {
      addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        console.log(email, password)
        if (!user) {
          throw new AuthenticationError("No User found with this email");
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError("Incorrect credentials");
        }
  
        const token = signToken(user);
  
        return { token, user };
      },
      saveBook: async (parent, { authors, description, title, bookId, image, link }, context) => {
        if (context.user) {
  
          const user = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: {
                savedBooks: {
                  authors, description: description?description:"no description ", title, bookId, image, link
                }
              }
            }
          );
  
          return user;
        }
        throw new AuthenticationError("Please log in");
      },
  
      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
  
          const user = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
  
          return user;
        }
        throw new AuthenticationError("Please log in");
      },
    },
  };
  
  module.exports = resolvers;