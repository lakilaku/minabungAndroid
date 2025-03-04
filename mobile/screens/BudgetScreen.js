import React, { useRef, useMemo, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import BottomSheetComponent from "../components/bottomsheet";
import BarChartComponent from "../components/barchart";
import PieChartComponent from "../components/piechart";

// const GET_ALL_TRANSACTIONS = gql``

// const GET_THIS_MONTH_EXPENSES = gql`
//   query GetThisMonthExpenses($groupId: ID!) {
//     getThisMonthExpenses(groupId: $groupId) {
//       _id
//       name
//       note
//       amount
//       date
//       budgetId
//     }
//   }
// `;

// const GET_THIS_MONTH_INCOMES = gql`
//   query GetThisMonthIncomes($groupId: ID!) {
//     getThisMonthIncomes(groupId: $groupId) {
//       _id
//       name
//       note
//       amount
//       date
//     }
//   }
// `;

const BudgetScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["10%", "70%"], []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F9D976" }}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Aqbils Family</Text>
        <Text style={styles.subTitle}>This month</Text>
      </View>

      {/* Pie Chart */}
      <PieChartComponent />

      {/* Bar Chart */}
      <BarChartComponent />

      {/* Bottom Sheet */}
      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    justifyContent: "center",
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    color: "#404040",
  },
});

export default BudgetScreen;
