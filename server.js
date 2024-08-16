import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    content: "First",
    userId: "2"
  },
  {
    id: "2",
    content: "Second",
    userId: "1"
  },
];

let users = [
    {
        id: "1",
        firstName: "A",
        lastName: "B"
    },
    {
        id:"2",
        firstName: "AA",
        lastName: "BB",
    }
];

/**
 * Query = request GET + URL
 * Mutation = request POST / DELETE / PUT + URL
 */
const typeDefs = gql`
  type User {
    id: ID!
    nickName: String
    firstName: String!
    lastName: String!
    fullName: String!
  }
  """
  Tweet Object is represent of Post. 
  This includes id, content and author(User). 
  content and author must include.
  """
  type Tweet {
    id: ID!
    content: String!
    author: User!
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(content: String!, userId: ID!): Tweet!
    """
    Delete a tweet with ID if tweet exists then return true otherwise return false.
    """
    deleteTweet(id: ID!): Boolean!
  }
`; // SchemaDefinitionLanguage

/**
 * Resquest fields then this resolvers invokes
 */
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers(){
        return users;
    },
  },
  Mutation: {
    postTweet(_, { content, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        content,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
        const tweet = tweets.find(tw => tw.id === id);
        if(!tweet) return false;
        tweets = tweets.filter(tw => tw.id !== id);
        return true;
    },
  },
  User: {
    fullName({firstName, lastName}){
        return `${firstName} ${lastName}`;
    }
  },
  Tweet: {
    author({userId}){
        const user = users.find(user => user.id === userId);
        if(!user) throw new Error(`User ID: ${userId} cannot find.`);
        return user;
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
