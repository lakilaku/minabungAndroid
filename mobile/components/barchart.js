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
      spacing: 2,
      labelWidth: 60,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    });

    // Second bar: total expense (no label so it shows right after the first)
    barData.push({
      value: totalExpense,
      frontColor: "#ED6665",
    });
  });

  if (barData.length === 0) {
    // Provide a fallback if there are no budgets
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
      frontColor: "#ED6665",
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
        showScrollIndicator
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
    width: "100%",
    height: 320, // Enough vertical space for bars
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingTop: 10,
    borderRadius: 10,
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
  chartStyle: {
    marginTop: 10,
  },
});
export default BarChartComponent;
