import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSecure } from "../utils/SecureStore";
import { createUploadLink } from "apollo-upload-client";

const uploadLink = createUploadLink({
  uri: "https://minabung.kyoutaroo.com/graphql",
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
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});

export default client;
