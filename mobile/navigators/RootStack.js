const {
  createNativeStackNavigator,
} = require("@react-navigation/native-stack");
import LoginScreen from "../screens/LoginScreen";
import { Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import RegisterScreen from "../screens/RegisterScreen";
import { getSecure } from "../utils/SecureStore";
import HomeScreen from "../screens/HomeScreen";
import BudgetScreen from "../screens/BudgetScreen";
import MenuBar from "../components/menubar";
import ProfileScreen from "../screens/ProfileScreen";
import AddIncomeExpenseScreen from "../screens/AddIncomeExpenseScreen";
import JoinGroupScreen from "../screens/JoinGroupScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    async function checkAuth() {
      const accessToken = await getSecure("accessToken");
      if (accessToken) {
        setIsSignedIn(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0077B5",
          },
          headerTintColor: "#fff",
        }}
      >
        {isSignedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Overview",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Budget"
              component={BudgetScreen}
              options={{
                title: "Budget",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Add"
              component={AddIncomeExpenseScreen}
              options={{
                title: "Add Income/Expense",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: "Profile",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="JoinGroup"
              component={JoinGroupScreen}
              options={{
                title: "JoinGroup",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CreateGroup"
              component={CreateGroupScreen}
              options={{
                title: "CreateGroup",
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Login", headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Register", headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
      {isSignedIn && (
        <View style={{ backgroundColor: "#f5c400", paddingBottom: 30 }}>
          <MenuBar navigation={navigation} />
        </View>
      )}
    </>
  );
}
