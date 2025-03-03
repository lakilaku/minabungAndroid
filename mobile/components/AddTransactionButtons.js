import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AddTransactionButtons = () => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.addButton, styles.addIncomeButton]}>
        <Text style={styles.buttonText}>Add Income</Text>
        <View style={styles.iconCircleGreen}>
          <Icon name="arrow-downward" size={24} color="white" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.addButton, styles.addExpenseButton]}>
        <Text style={styles.buttonText}>Add Expense</Text>
        <View style={styles.iconCircleRed}>
          <Icon name="arrow-upward" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addIncomeButton: {
    marginRight: 10,
  },
  addExpenseButton: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginRight: 10,
  },
  iconCircleGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleRed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddTransactionButtons;
