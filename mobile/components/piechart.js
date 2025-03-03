import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

//query dari limit sum budget

// query Query($getGroupByIdId: ID!) {
//   getGroupById(id: $getGroupByIdId) {
//     _id
//     name
//     description
//     members {
//       _id
//       name
//       role
//     }
//     incomes {
//       _id
//       name
//       note
//       amount
//       date
//     }
//     expenses {
//       _id
//       name
//       note
//       amount
//       date
//       budgetId
//     }
//     budgets {
//       _id
//       name
//       limit
//       icon
//       color
//     }
//     invite
//   }
// }

const pieData = [
  { value: 70, color: "#ED6665", label: "Used" },
  { value: 30, color: "lightgray", label: "Remaining" },
];

const PieChartComponent = () => {
  const backgroundColor = "#F9D976";
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
      {/* Pie Chart */}
      <PieChart
        pie
        radius={100}
        innerCircleColor={backgroundColor}
        data={pieData}
      />

      {/* Legend */}
      {/* ambil dari getGroupbyId (securestore) */}
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
