import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AddGroup = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get Started</Text>
      <Text style={styles.subtitle}>
        Would you like to create or join a group?
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>
            Create Group
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("CreateGroupAi")}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>
            Need Help?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.tertiaryButton]}
          onPress={() => navigation.navigate("JoinGroup")}
        >
          <Text style={[styles.buttonText, styles.tertiaryText]}>
            Join Group
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC067",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FFC067",
  },
  button: {
    width: "90%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#34C759",
    shadowColor: "#34C759",
  },
  tertiaryButton: {
    backgroundColor: "#FF9500",
    shadowColor: "#FF9500",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryText: {
    color: "#FFF",
  },
  secondaryText: {
    color: "#FFF",
  },
  tertiaryText: {
    color: "#FFF",
  },
});

export default AddGroup;
