import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { saveSecure } from "../utils/SecureStore";
import Ionicons from "react-native-vector-icons/Ionicons";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      access_token
      user {
        _id
        name
        username
        email
        gender
        profilePicture
        birthDate
        groupId
      }
    }
  }
`;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsSignedIn } = useContext(AuthContext);
  const [loginAccess, { loading }] = useMutation(LOGIN);
  const navigation = useNavigation();

  const handleSubmitLogin = async () => {
    try {
      const { data } = await loginAccess({ variables: { email, password } });
      const { access_token, user } = data.Login;
      // Save token & user info securely
      await saveSecure("accessToken", access_token);
      await saveSecure("userData", JSON.stringify(user));

      setIsSignedIn(true);
      Alert.alert(
        "Login Successful",
        `Welcome back, ${user.name}!`,
        [{ text: "OK", onPress: () => navigation.navigate("Home") }],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("Error!", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/1200x/37/e4/35/37e4355509ff05bc62233d211e96f68b.jpg",
        }}
        style={styles.background}
      >
        {/* Semi‐transparent overlay to make text more readable */}
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Minabung</Text>
            <Text style={styles.subtitle}>Please sign in to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputWrapper, { marginBottom: 5 }]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { marginRight: 10 }]}
                placeholder="Password"
                placeholderTextColor="#999"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
              />
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Forgot Password", "Feature coming soon!")
                }
              >
                <Text style={styles.forgotText}>FORGOT</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#F7BA3E"
                style={{ marginTop: 20 }}
              />
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSubmitLogin}
              >
                <Text style={styles.loginButtonText}>LOGIN</Text>
              </TouchableOpacity>
            )}

            {/* Sign Up Prompt */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  headerContainer: {
    marginTop: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
  },
  formContainer: {},
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F7BA3E",
  },
  loginButton: {
    backgroundColor: "#F7BA3E",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  signupText: {
    fontSize: 14,
    color: "black",
  },
  signupLink: {
    fontSize: 14,
    color: "#F7BA3E",
    fontWeight: "600",
  },
});
