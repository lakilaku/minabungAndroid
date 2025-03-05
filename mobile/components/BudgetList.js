import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FormatRupiah } from "../utils/NumberFormat";

const BudgetList = ({ budgets, expenses, onBudgetClick, selectedBudgetId }) => {
  const formatNumberWithDot = (num) => {
    if (isNaN(num)) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const renderBudgetItem = ({ item }) => {
    const totalExpense = expenses
      .filter((expense) => expense.budgetId === item._id)
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);

    const availableBudget = item.limit - totalExpense;

    return (
      <TouchableOpacity
        onPress={() => onBudgetClick(item._id)}
        style={[
          styles.budgetCard,
          {
            backgroundColor: item.color,
            borderWidth: selectedBudgetId === item._id ? 3 : 0,
            borderColor:
              selectedBudgetId === item._id ? "#FFD700" : "transparent",
            opacity:
              selectedBudgetId === null || selectedBudgetId === item._id
                ? 1
                : 0.5,
          },
        ]}
      >
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
        <Text
          style={[
            styles.budgetCardLabel,
            { fontSize: item.name.length > 17 ? 12 : 14 },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
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
    // height: 100,
    borderRadius: 16,
    marginRight: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 6,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 10,
    // // position: "absolute",
    // top: 10,
    // right: 10,
    zIndex: 1,
  },
  budgetCardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    // position: "absolute",
    // bottom: 10,
    // right: 10,
    // paddingBottom: 5,
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
    // position: "absolute",
    // bottom: 5,
    // right: 10,
    width: "100%",
    textAlign: "right",
    marginBottom: 8,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default BudgetList;
