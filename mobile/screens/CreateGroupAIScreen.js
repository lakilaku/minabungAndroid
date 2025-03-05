import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GET_GROUP_BY_USER_ID } from "./HomeScreen";
import { GET_THIS_MONTH_INCOME_EXPENSES } from "../components/TransactionList";
import { getSecure } from "../utils/SecureStore";

const CREATE_AI_GROUP = gql`
  mutation CreateAIGroup($userPrompt: String!) {
    createAIGroup(userPrompt: $userPrompt) {
      _id
      name
      description
      budgets {
        _id
        name
        limit
        icon
        color
      }
    }
  }
`;

const CreateAIGroupScreen = ({ navigation }) => {
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedGroup, setGeneratedGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const [createGroup, { loading, error }] = useMutation(CREATE_AI_GROUP, {
    onCompleted: (data) => {
      setGeneratedGroup(data.createAIGroup);
    },
    refetchQueries: [
      {
        query: GET_GROUP_BY_USER_ID,
        variables: { userId },
      },
    ],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getSecure("userData");
        if (user) {
          const parsedUser = JSON.parse(user);
          if (parsedUser._id) {
            setUserId(parsedUser._id);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleGenerateGroup = async () => {
    if (!userPrompt.trim()) return alert("Please enter a prompt!");
    try {
      await createGroup({ variables: { userPrompt } });
    } catch (err) {
      console.error("❌ Error creating AI group:", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create AI-Generated Financial Group</Text>

      <View style={styles.inputContainer}>
        <Icon name="edit" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={
            "Enter your prompt. It is recommended to make the prompt as detailed as possible!\n\n" +
            "Example: I want a budget plan for a family of 4 named Budi Family.\n\n" +
            "The family has a budget limit of 10.000.000.\n\n" +
            "I want 3.000.000 allocated for food.\n" +
            "2.000.000 for family shopping.\n" +
            "1.000.000 for savings.\n" +
            "2.000.000 for transports.\n" +
            "and 2.000.000 for miscellaneous."
          }
          value={userPrompt}
          onChangeText={setUserPrompt}
          multiline
        />
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateGroup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Generate Group</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      {generatedGroup && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Generated Group</Text>
          <Text style={styles.groupName}>{generatedGroup.name}</Text>
          <Text style={styles.groupDescription}>
            {generatedGroup.description}
          </Text>

          <Text style={styles.budgetTitle}>Budgets:</Text>
          {generatedGroup.budgets.map((budget) => (
            <View
              key={budget._id}
              style={[styles.budgetItem, { backgroundColor: budget.color }]}
            >
              <Icon name={budget.icon} size={24} color="#fff" />
              <View style={styles.budgetTextContainer}>
                <Text style={styles.budgetName}>{budget.name}</Text>
                <Text style={styles.budgetLimit}>
                  Limit: {budget.limit.toLocaleString()}
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFC067",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "top",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    height: 500,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#102A71",
    borderRadius: 10,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#102A71",
    marginBottom: 5,
  },
  groupDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  budgetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  budgetTextContainer: {
    marginLeft: 10,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  budgetLimit: {
    fontSize: 14,
    color: "#fff",
  },
  confirmButton: {
    backgroundColor: "#FF5733",
    borderRadius: 10,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
});

export default CreateAIGroupScreen;
