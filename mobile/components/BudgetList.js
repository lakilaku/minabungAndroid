import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FormatRupiah } from "../utils/NumberFormat";

const BudgetList = ({ budgets, expenses }) => {
  // Helper to format a number with dot as thousand separator (without currency prefix)
  const formatNumberWithDot = (num) => {
    if (isNaN(num)) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const renderBudgetItem = ({ item }) => {
    // Calculate total expenses for this budget
    const totalExpense = expenses
      .filter((expense) => expense.budgetId === item._id)
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);

    // Calculate available budget
    const availableBudget = item.limit - totalExpense;

    return (
      <View style={[styles.budgetCard, { backgroundColor: item.color }]}>
        <Icon
          name={item.icon || "help-outline"}
          size={30}
          color="#ffffff"
          style={styles.icon}
        />
        <Text style={styles.budgetCardAmount}>
          <Text style={availableBudget <= 0 ? styles.availableRed : {}}>
            {FormatRupiah(availableBudget)}
          </Text>
          <View style={styles.limitContainer}>
            <Text style={styles.limitText}>
              {" / "}
              {formatNumberWithDot(item.limit)}
            </Text>
          </View>
        </Text>
        <Text style={styles.budgetCardLabel}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.budgetContainer}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetTitle}>Budgets</Text>
      </View>
      <FlatList
        data={budgets}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item._id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.budgetList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  budgetContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  budgetList: {
    paddingVertical: 10,
  },
  budgetCard: {
    width: 150,
    height: 100,
    borderRadius: 16,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  icon: {
    width: 30,
    height: 30,
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  budgetCardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    position: "absolute",
    bottom: 10,
    right: 10,
    marginBottom: 5,
    paddingBottom: 5,
  },
  availableRed: {
    color: "red",
  },
  limitContainer: {
    alignItems: "flex-end",
    paddingLeft: 20,
  },
  limitText: {
    color: "#fff",
    textAlign: "right",
    fontSize: 14,
  },
  budgetCardLabel: {
    fontSize: 14,
    color: "#fff",
    position: "absolute",
    bottom: 5,
    right: 10,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default BudgetList;
