import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const PieChartComponent = ({ group }) => {
  const backgroundColor = "#F9D976";
  const pieData =
    group?.budgets?.map((budget) => ({
      value: Number(budget.limit),
      color: budget.color || "#ED6665",
      label: budget.name,
    })) || [];

  if (!pieData.length) {
    return (
      <View
        style={{ alignItems: "center", justifyContent: "center", padding: 20 }}
      >
        <Text>No budget data available</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        backgroundColor: backgroundColor,
      }}
    >
      <PieChart
        pie
        radius={100}
        innerCircleColor={backgroundColor}
        data={pieData}
      />
      <View style={{ marginLeft: 20 }}>
        {pieData.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: item.color,
                borderRadius: 6,
                marginRight: 5,
              }}
            />
            <Text style={{ fontSize: 14 }}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PieChartComponent;
