import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const JoinGroupScreen = () => {
  const [groupCode, setGroupCode] = useState("");

  const handleJoinGroup = () => {
    console.log("Joining group with code:", groupCode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Group</Text>

      <Text style={styles.label}>Group Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter group code"
        placeholderTextColor="#999"
        value={groupCode}
        onChangeText={setGroupCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleJoinGroup}>
        <Text style={styles.buttonText}>Join Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5C400",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2D6AA6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default JoinGroupScreen;
