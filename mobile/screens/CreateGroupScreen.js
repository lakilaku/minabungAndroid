import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useMutation, gql } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $description: String) {
    createGroup(name: $name, description: $description) {
      name
      description
    }
  }
`;

const CreateGroupScreen = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const navigation = useNavigation();
  
  const [createGroup, { loading, error }] = useMutation(CREATE_GROUP);

  const handleCreateGroup = async () => {
    try {
      const { data } = await createGroup({
        variables: { name: groupName, description },
      });
      Alert.alert("Success", "Group created successfully!", [{ text: "OK", onPress: () => navigation.goBack() }]);
      setGroupName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>

      <Text style={styles.label}>Group Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter group name"
        placeholderTextColor="#999"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter description"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleCreateGroup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Create Group"}</Text>
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
  textArea: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default CreateGroupScreen;
