import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSecure } from "../utils/SecureStore";

const httpLink = createHttpLink({
  uri: "http://192.168.18.25:4000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getSecure("accessToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
