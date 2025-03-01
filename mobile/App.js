import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootStack from "./navigators/RootStack";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import AuthProvider from "./contexts/AuthContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </ApolloProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
