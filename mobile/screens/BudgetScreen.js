import React, { useRef, useMemo, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import BottomSheetComponent from "../components/bottomsheet";
import BarChartComponent from "../components/barchart";
import PieChartComponent from "../components/piechart";

const BudgetScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["10%", "70%"], []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Aqbils Family</Text>
        <Text style={styles.subTitle}>This month</Text>
      </View>

      {/* Bar Chart */}
      <BarChartComponent />

      {/* Pie Chart */}
      <PieChartComponent />

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
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: "#7F8C8D",
  },
});

export default BudgetScreen;
