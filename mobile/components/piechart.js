import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const pieData = [
  { value: 70, color: "#ED6665" },
  { value: 30, color: "lightgray" },
];

const PieChartComponent = () => {
  return (
    <View style={{ alignItems: "center", marginTop: 30 }}>
      <PieChart
        donut
        innerRadius={70}
        radius={100}
        data={pieData}
        centerLabelComponent={() => (
          <View>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>70%</Text>
            <Text style={{ fontSize: 10 }}>is being used</Text>
          </View>
        )}
      />
    </View>
  );
};

export default PieChartComponent;
