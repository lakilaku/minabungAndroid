import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const BarChartComponent = ({ group }) => {
  const budgets = group?.budgets || [];
  const expenses = group?.expenses || [];

  // Build a single array of bars, each budget becomes 2 items:
  // 1) Budget Limit (blue) with label
  // 2) Total Expense (red) without label
  const barData = [];
  budgets.forEach((budget) => {
    const totalExpense = expenses
      .filter((exp) => exp.budgetId === budget._id)
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // First bar: label + budget limit
    barData.push({
      value: budget.limit,
      label: budget.name,
      spacing: 5,
      labelWidth: 60,
      labelTextStyle: { color: "#4d4c4c" },
      frontColor: "#1253c4",
    });

    // Second bar: total expense (no label so it shows right after the first)
    barData.push({
      value: totalExpense,
      frontColor: "#d13f3f",
    });
  });

  if (barData.length === 0) {
    barData.push({
      value: 0,
      label: "No Budgets",
      spacing: 2,
      labelWidth: 60,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    });
    barData.push({
      value: 0,
      frontColor: "#cf2d2d",
    });
  }

  const maxBarValue = Math.max(...barData.map((item) => item.value));

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#177AD5" }]} />
          <Text style={styles.legendText}>Budget Limit</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#ED6665" }]} />
          <Text style={styles.legendText}>Total Expenses</Text>
        </View>
      </View>

      <BarChart
        data={barData}
        barWidth={20}
        spacing={30}
        hideRules
        // showScrollIndicator
        maxValue={maxBarValue}
        noOfSections={4}
        yAxisTextStyle={{ color: "gray" }}
        xAxisThickness={1}
        yAxisThickness={1}
        style={styles.chartStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "91%",
    height: 320, // Enough vertical space for bars
    backgroundColor: "#fcf4d4",
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    color: "#404040",
  },
  chartStyle: {},
});
export default BarChartComponent;
