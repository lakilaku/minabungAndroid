import React, { useState } from "react";
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

const dummyData = {
  getGroupById: {
    budgets: [
      { _id: "1", name: "Food", icon: "restaurant", color: "#FF5733" },
      { _id: "2", name: "Transport", icon: "directions-bus", color: "#3498DB" },
      { _id: "3", name: "Shopping", icon: "shopping-cart", color: "#F1C40F" },
      { _id: "4", name: "Health", icon: "local-hospital", color: "#2ECC71" },
      { _id: "5", name: "Entertainment", icon: "movie", color: "#9B59B6" },
      { _id: "6", name: "Education", icon: "school", color: "#E67E22" },
      { _id: "7", name: "Bills", icon: "receipt", color: "#1ABC9C" },
      { _id: "8", name: "Savings", icon: "savings", color: "#E74C3C" },
    ],
  },
};

const GET_GROUP_BY_ID = gql`
  query Query($getGroupByIdId: ID!) {
    getGroupById(id: $getGroupByIdId) {
      _id
      name
      description
      members {
        _id
        name
        role
      }
      incomes {
        _id
        name
        note
        amount
        date
      }
      expenses {
        _id
        name
        note
        amount
        date
        budgetId
      }
      budgets {
        _id
        name
        limit
        icon
        color
      }
      invite
    }
  }
`;

const GET_CATEGORIES = gql`
  query Query($getGroupByIdId: ID!) {
    getGroupById(id: $getGroupByIdId) {
      budgets {
        _id
        name
        icon
        color
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
      date
      budgetId
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
      note
      amount
      date
    }
  }
`;

const ExpenseIncomeScreen = () => {
  const [selectedType, setSelectedType] = useState("Expense");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const groupId = "yourGroupId";

  const { data, loading, error } = useQuery(GET_CATEGORIES, {
    variables: { getGroupByIdId: groupId },
    skip: true,
  });
  const [addExpense] = useMutation(CREATE_POST_EXPENSE, {
    onCompleted: () => Alert.alert("Success", "Expense added successfully"),
    onError: (err) => Alert.alert("Error", err.message),
  });
  const [addIncome] = useMutation(CREATE_POST_INCOME, {
    onCompleted: () => Alert.alert("Success", "Income added successfully"),
    onError: (err) => Alert.alert("Error", err.message),
  });

  const handleAddTransaction = async () => {
    if (!selectedCategory || !amount) {
      Alert.alert("Error", "Please select a category and enter an amount");
      return;
    }

    try {
      const variables = {
        name,
        amount: parseFloat(amount),
        groupId,
        note: note || "",
        budgetId: selectedCategory?._id,
      };

      if (selectedType === "Expense") {
        await addExpense({ variables });
      } else {
        await addIncome({ variables });
      }
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error loading categories...</Text>;
  }

  const categories =
    data?.getGroupById?.budgets || dummyData.getGroupById.budgets;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Transactions</Text>
      </View>
      {/* Expense / Income Toggle */}
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
          <Icon
            name="trending-down"
            size={16}
            color={selectedType === "Expense" ? "red" : "black"}
          />
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
          <Icon
            name="trending-up"
            size={16}
            color={selectedType === "Income" ? "green" : "black"}
          />
        </TouchableOpacity>
      </View>

      {/* Grid of Categories */}
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

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          multiline
          value={note}
          onChangeText={setNote}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          multiline
          value={note}
          onChangeText={setNote}
        />
        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTransaction}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
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
  inputContainer: {
    flex: 1,
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
