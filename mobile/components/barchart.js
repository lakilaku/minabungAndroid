import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const barData = [
  { value: 2000000, label: "Jan", frontColor: "#177AD5" },
  { value: 1000000, frontColor: "#ED6665" },
  { value: 50, label: "Feb", frontColor: "#177AD5" },
  { value: 40, frontColor: "#ED6665" },
  { value: 75, label: "Mar", frontColor: "#177AD5" },
  { value: 25, frontColor: "#ED6665" },
  { value: 30, label: "Apr", frontColor: "#177AD5" },
  { value: 20, frontColor: "#ED6665" },
  { value: 60, label: "May", frontColor: "#177AD5" },
  { value: 40, frontColor: "#ED6665" },
  { value: 65, label: "Jun", frontColor: "#177AD5" },
  { value: 30, frontColor: "#ED6665" },
];

const BarChartComponent = () => {
  return (
    <View style={{ paddingHorizontal: 40, borderRadius: 10 }}>
      {/* Title Section */}
      <View
        style={{
          marginVertical: 10,
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 24,
          marginHorizontal: 20,
        }}
      >
        <Legend color="#177AD5" text="Income" />
        <Legend color="#ED6665" text="Expense" />
      </View>

      {/* Bar Chart */}
      <BarChart
        data={barData}
        barWidth={7}
        spacing={20}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: "gray" }}
        noOfSections={4}
        maxValue={10000000}
      />
    </View>
  );
};

const Legend = ({ color, text }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <View
      style={{
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: color,
        marginRight: 8,
      }}
    />
    <Text style={{ color: "#404040" }}>{text}</Text>
  </View>
);

export default BarChartComponent;
