import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const BarChartComponent = ({ group }) => {
  const incomes = group?.incomes || [];
  const expenses = group?.expenses || [];
  const now = new Date();

  // Filter incomes and expenses for the current month using Number() to parse the date.
  const currentIncomes = incomes.filter((income) => {
    const d = new Date(Number(income.date));
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const currentExpenses = expenses.filter((expense) => {
    const d = new Date(Number(expense.date));
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  const getWeekOfMonth = (dateStr) => {
    if (!dateStr) return 1;
    const date = new Date(Number(dateStr));
    if (isNaN(date.getTime())) return 1;
    return Math.ceil(date.getDate() / 7);
  };

  const weeklyData = {};
  currentIncomes.forEach((income) => {
    const week = getWeekOfMonth(income.date);
    if (!weeklyData[week]) weeklyData[week] = { income: 0, expense: 0 };
    weeklyData[week].income += income.amount || 0;
  });
  currentExpenses.forEach((expense) => {
    const week = getWeekOfMonth(expense.date);
    if (!weeklyData[week]) weeklyData[week] = { income: 0, expense: 0 };
    weeklyData[week].expense += expense.amount || 0;
  });

  const weeks = Object.keys(weeklyData)
    .map(Number)
    .sort((a, b) => a - b);

  const barData = weeks.map((week) => ({
    label: `Week ${week}`,
    data: [
      { value: weeklyData[week].income, frontColor: "#177AD5" },
      { value: weeklyData[week].expense, frontColor: "#ED6665" },
    ],
  }));

  if (barData.length === 0) {
    barData.push({
      label: "Week 1",
      data: [
        { value: 0, frontColor: "#177AD5" },
        { value: 0, frontColor: "#ED6665" },
      ],
    });
  }

  const maxBarValue = Math.max(
    ...barData.flatMap((item) => item.data.map((bar) => bar.value)),
    1000
  );

  const Legend = ({ color, text }) => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}
    >
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: color,
          marginRight: 5,
        }}
      />
      <Text style={{ color: "#404040" }}>{text}</Text>
    </View>
  );

  return (
    <View style={{ paddingHorizontal: 40, borderRadius: 10 }}>
      <View
        style={{
          marginVertical: 10,
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Legend color="#177AD5" text="Income" />
        <Legend color="#ED6665" text="Expense" />
      </View>
      <BarChart
        data={barData}
        isGrouped
        barWidth={10}
        spacing={30}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: "gray" }}
        noOfSections={4}
        maxValue={maxBarValue}
      />
    </View>
  );
};

export default BarChartComponent;
