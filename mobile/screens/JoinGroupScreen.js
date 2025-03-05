import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useMutation, gql } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const JOIN_GROUP = gql`
  mutation JoinGroup($invite: String!) {
    joinGroup(invite: $invite) {
      name
      description
    }
  }
`;

const JoinGroupScreen = () => {
  const [groupCode, setGroupCode] = useState("");
  const navigation = useNavigation();

  const [joinGroup, { loading, error }] = useMutation(JOIN_GROUP);

  const handleJoinGroup = async () => {
    try {
      const { data } = await joinGroup({
        variables: { invite: groupCode },
      });
      Alert.alert("Success", "Successfully joined the group!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setGroupCode("");
    } catch (err) {
      Alert.alert("Error joining group:", err);
    }
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

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleJoinGroup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Joining..." : "Join Group"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC067",
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default JoinGroupScreen;
