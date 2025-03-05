import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const PieChartComponent = ({ group }) => {
  const backgroundColor = "#FFF0C2"; // Warm, light tone to match #F8DE7E

  // Calculate total for percentage computation
  const pieData =
    group?.budgets?.map((budget) => ({
      value: Number(budget.limit),
      color: budget.color || "#FF6B6B",
      label: budget.name,
    })) || [];

  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
  const pieDataWithPercentages = pieData.map((item) => ({
    ...item,
    percentage:
      totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : "0.0",
  }));

  if (!pieData.length) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          marginHorizontal: 20,
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#5A3D00",
            fontWeight: "500",
          }}
        >
          No budget data available
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fcf4d9",
        borderRadius: 16,
        marginHorizontal: 16,
      }}
    >
      <View
        style={{
          padding: 16,
        }}
      >
        <PieChart
          pie
          radius={90}
          data={pieData}
          border={true}
          borderWidth={2}
        />
      </View>
      <View
        style={{
          backgroundColor: backgroundColor,
          justifyContent: "center",
          height: 220,
          padding: 12,
          borderRadius: 10,
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
        }}
      >
        {pieDataWithPercentages.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
              paddingVertical: 2,
            }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                backgroundColor: item.color,
                borderRadius: 7,
                marginRight: 8,
                borderWidth: 1,
                borderColor: "#FFF0C2",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#5A3D00",
                fontWeight: "500",
                letterSpacing: 0.2,
              }}
            >
              {item.label} ({item.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PieChartComponent;
