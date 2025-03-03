import React, { useState } from "react";
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
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const REGISTER = gql`
  mutation Register(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
    $gender: String!
  ) {
    Register(
      name: $name
      username: $username
      email: $email
      password: $password
      gender: $gender
    ) {
      name
      email
      gender
    }
  }
`;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const navigation = useNavigation();

  const [register, { loading, error }] = useMutation(REGISTER, {
    onCompleted: () => {
      // Navigate to Login once registration is successful
      navigation.navigate("Login");
    },
    onError: (err) => {
      Alert.alert("Registration Failed", err.message);
    },
  });

  const handleRegister = async () => {
    if (!name || !username || !email || !password || !gender) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }

    try {
      await register({
        variables: { name, username, email, password, gender },
      });
      Alert.alert(
        "Register Successful",
        "You can now log in!",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
        { cancelable: false }
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error!", error?.message || "Something went wrong");
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
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Please fill in the details below
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="at-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
              />
            </View>

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
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Gender Input */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="male-female-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Gender"
                placeholderTextColor="#999"
                value={gender}
                onChangeText={setGender}
              />
            </View>

            {/* Register Button */}
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#F7BA3E"
                style={{ marginTop: 20 }}
              />
            ) : (
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>REGISTER</Text>
              </TouchableOpacity>
            )}

            {/* Already have an account? */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}> Log in</Text>
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
    marginBottom: 15,
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
  registerButton: {
    backgroundColor: "#F7BA3E",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  registerButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  loginText: {
    fontSize: 14,
    color: "#333",
  },
  loginLink: {
    fontSize: 14,
    color: "#F7BA3E",
    fontWeight: "600",
  },
});
