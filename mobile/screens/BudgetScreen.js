import React, { useRef, useMemo } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const BudgetScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["10%", "70%"], []);
  const barData = [
    {
      value: 40,
      label: "Jan",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 50,
      label: "Feb",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 75,
      label: "Mar",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 25, frontColor: "#ED6665" },
    {
      value: 30,
      label: "Apr",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 20, frontColor: "#ED6665" },
    {
      value: 60,
      label: "May",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 40, frontColor: "#ED6665" },
    {
      value: 65,
      label: "Jun",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: "#177AD5",
    },
    { value: 30, frontColor: "#ED6665" },
  ];
  const pieData = [
    { value: 70, color: "#ED6665" },
    { value: 30, color: "lightgray" },
  ];
  const renderTitle = () => {
    return (
      <View style={{ marginVertical: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "#177AD5",
                marginRight: 8,
              }}
            />
            <Text
              style={{
                width: 60,
                height: 16,
                color: "gray",
              }}
            >
              Income
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "#ED6665",
                marginRight: 8,
              }}
            />
            <Text
              style={{
                width: 60,
                height: 16,
                color: "gray",
              }}
            >
              Expense
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Aqbils Family</Text>
        <Text style={styles.subTitle}>This month</Text>
      </View>
      <View
        style={{
          paddingHorizontal: 40,
          borderRadius: 10,
        }}
      >
        {renderTitle()}
        <BarChart
          data={barData}
          barWidth={8}
          spacing={24}
          roundedTop
          roundedBottom
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: "gray" }}
          noOfSections={3}
          maxValue={75}
        />
      </View>
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <PieChart
          donut
          innerRadius={70}
          radius={100}
          data={pieData}
          centerLabelComponent={() => {
            return (
              <View>
                <Text style={{ fontSize: 30, fontWeight: "bold" }}>70%</Text>
                <Text style={{ fontSize: 10 }}>is being used</Text>
              </View>
            );
          }}
        />
      </View>
      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        <View style={styles.bottomSheetContent}>
          <Text style={styles.sheetTitle}>Budget Details</Text>
          <BottomSheetFlatList
            data={[
              { key: "Total Income: $5000" },
              { key: "Total Expenses: $3500" },
              { key: "Remaining: $1500" },
              { key: "Food: $500" },
              { key: "Rent: $1200" },
              { key: "Transport: $300" },
              { key: "Shopping: $200" },
              { key: "Savings: $1000" },
            ]}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <Text style={styles.sheetItem}>{item.key}</Text>
            )}
          />
        </View>
      </BottomSheet>
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
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: "#7F8C8D",
  },
  bottomSheetContent: {
    padding: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sheetItem: {
    fontSize: 16,
    paddingVertical: 8,
  },
});

export default BudgetScreen;
