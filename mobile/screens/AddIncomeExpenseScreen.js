import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { gql, useMutation, useQuery } from "@apollo/client";
import { getSecure } from "../utils/SecureStore";
import { FormatRupiah } from "../utils/NumberFormat";

const GET_GROUP_BY_USER_ID = gql`
  query GetGroupByUserId($userId: ID!) {
    getGroupByUserId(userId: $userId) {
      _id
      name
      budgets {
        _id
        name
        color
        icon
      }
    }
  }
`;

const CREATE_POST_EXPENSE = gql`
  mutation AddExpense(
    $name: String!
    $amount: Float!
    $groupId: ID!
    $note: String
    $budgetId: ID
  ) {
    addExpense(
      name: $name
      amount: $amount
      groupId: $groupId
      note: $note
      budgetId: $budgetId
    ) {
      name
      amount
      note
    }
  }
`;

const CREATE_POST_INCOME = gql`
  mutation AddIncome(
    $amount: Float!
    $note: String
    $name: String!
    $groupId: ID!
  ) {
    addIncome(amount: $amount, note: $note, name: $name, groupId: $groupId) {
      _id
      name
      amount
      note
    }
  }
`;

const ExpenseIncomeScreen = () => {
  const [selectedType, setSelectedType] = useState("Expense");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");

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

  const { data, loading, error } = useQuery(GET_GROUP_BY_USER_ID, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data?.getGroupByUserId?.length > 0 && !selectedGroup) {
      setSelectedGroup(data.getGroupByUserId[0]);
    }
  }, [data]);

  const [addExpense] = useMutation(CREATE_POST_EXPENSE, {
    onCompleted: () => Alert.alert("Success", "Expense added successfully"),
    onError: (err) => Alert.alert("Error", err.message),
  });

  const [addIncome] = useMutation(CREATE_POST_INCOME, {
    onCompleted: () => Alert.alert("Success", "Income added successfully"),
    onError: (err) => Alert.alert("Error", err.message),
  });

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error loading data: {error.message}</Text>;
  }

  const categories = selectedGroup?.budgets || [];

  const handleAddTransaction = async () => {
    if (!selectedGroup) {
      Alert.alert("Error", "No group selected");
      return;
    }

    if (selectedType === "Expense") {
      if (!selectedCategory || !amount) {
        Alert.alert("Error", "Please select a category and enter an amount");
        return;
      }
      const postExpense = await addExpense({
        variables: {
          name,
          amount: parseFloat(amount),
          groupId: selectedGroup?._id,
          note,
          budgetId: selectedCategory?._id,
        },
      });
      if (!postExpense) {
        Alert.alert("Error", "Failed to add expense");
        return;
      }
    } else {
      if (!amount) {
        Alert.alert("Error", "Please enter an amount");
        return;
      }
      const postIncome = await addIncome({
        variables: {
          name,
          amount: parseFloat(amount),
          groupId: selectedGroup?._id,
          note,
        },
      });
      if (!postIncome) {
        Alert.alert("Error", "Failed to add income");
        return;
      }
    }
    setAmount("");
    setName("");
    setNote("");
    setSelectedCategory(null);
  };

  const formatRupiah = (value) => {
    if (!value) return "Rp.";
    return (
      "Rp." + parseFloat(value.replace(/\D/g, "") || 0).toLocaleString("id-ID")
    );
  };

  const parseNumber = (formattedValue) => {
    return formattedValue.replace(/\D/g, "");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Transactions</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedType === "Expense" && styles.selectedButton,
          ]}
          onPress={() => setSelectedType("Expense")}
        >
          <Text
            style={[
              styles.toggleText,
              selectedType === "Expense" && styles.selectedText,
            ]}
          >
            Expense
          </Text>
          <Icon name="trending-down" size={16} color="red" />
        </TouchableOpacity>

        <Text style={styles.separator}>|</Text>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedType === "Income" && styles.selectedButton,
          ]}
          onPress={() => setSelectedType("Income")}
        >
          <Text
            style={[
              styles.toggleText,
              selectedType === "Income" && styles.selectedText,
            ]}
          >
            Income
          </Text>
          <Icon name="trending-up" size={16} color="green" />
        </TouchableOpacity>
      </View>

      {selectedType === "Expense" && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          numColumns={4}
          columnWrapperStyle={styles.categoryRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory?._id === item._id && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Icon name={item.icon} size={24} color={item.color || "black"} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={formatRupiah(amount)}
        onChangeText={(text) => setAmount(parseNumber(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9D976",
    padding: 20,
  },
  header: {
    margin: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
    color: "black",
  },
  selectedText: {
    color: "black",
  },
  separator: {
    fontSize: 20,
    color: "black",
    marginHorizontal: 10,
  },
  selectedCategory: {
    backgroundColor: "#cfe1ff",
  },
  categoryRow: {
    justifyContent: "space-around",
    marginBottom: 15,
  },
  categoryItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: 70,
    elevation: 3,
  },
  categoryText: {
    fontSize: 12,
    marginTop: 5,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ExpenseIncomeScreen;
