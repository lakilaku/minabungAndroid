import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const expenseCategories = [
  { id: 1, name: "Food", icon: "fastfood" },
  { id: 2, name: "Transport", icon: "directions-bus" },
  { id: 3, name: "Shopping", icon: "shopping-bag" },
  { id: 4, name: "Entertainment", icon: "movie" },
  { id: 5, name: "Rent", icon: "home" },
  { id: 6, name: "Health", icon: "healing" },
  { id: 7, name: "Education", icon: "school" },
  { id: 8, name: "Other", icon: "more-horiz" },
];

const incomeCategories = [
  { id: 1, name: "Salary", icon: "attach-money" },
  { id: 2, name: "Freelance", icon: "work" },
  { id: 3, name: "Investments", icon: "trending-up" },
  { id: 4, name: "Business", icon: "storefront" },
  { id: 5, name: "Gifts", icon: "card-giftcard" },
  { id: 6, name: "Rental Income", icon: "real-estate-agent" },
  { id: 7, name: "Other", icon: "more-horiz" },
];

const ExpenseIncomeScreen = () => {
  const [selectedType, setSelectedType] = useState("Expense");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories =
    selectedType === "Expense" ? expenseCategories : incomeCategories;

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
            name="trending-up"
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
            name="trending-down"
            size={16}
            color={selectedType === "Income" ? "green" : "black"}
          />
        </TouchableOpacity>
      </View>

      {/* Grid of Categories */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        columnWrapperStyle={styles.categoryRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item.id && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Icon name={item.icon} size={24} color="black" />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
      />
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput style={styles.input} placeholder="Description" multiline />

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
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
