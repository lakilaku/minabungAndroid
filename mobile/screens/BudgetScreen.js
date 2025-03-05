import React, { useEffect, useRef, useState, useMemo } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import BottomSheetComponent from "../components/bottomsheet";
import BarChartComponent from "../components/barchart";
import PieChartComponent from "../components/piechart";
import { getSecure } from "../utils/SecureStore";

const BudgetScreen = () => {
  const [group, setGroup] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["14%"], []);

  useEffect(() => {
    const fetchGroup = async () => {
      const storedGroup = await getSecure("selectedGroup");
      if (storedGroup) setGroup(JSON.parse(storedGroup));
    };
    fetchGroup();
  }, []);

  if (!group) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>{group.name}</Text>
        <Text style={styles.subTitle}>This month</Text>
      </View>
      <PieChartComponent group={group} />
      <View style={{ height: 25 }} />
      <BarChartComponent group={group} />
      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        group={group}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8DE7E",
  },
  topContainer: {
    justifyContent: "center",
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    color: "#404040",
  },
});

export default BudgetScreen;
