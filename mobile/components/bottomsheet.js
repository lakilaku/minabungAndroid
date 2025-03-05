import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FormatRupiah } from "../utils/NumberFormat";

const BottomSheetComponent = ({ bottomSheetRef, snapPoints, group }) => {
  const [selectedTab, setSelectedTab] = useState("Expense");

  const sortedExpenses = useMemo(() => {
    const expenses = group?.expenses || [];
    return [...expenses].sort(
      (a, b) => parseInt(b.date, 10) - parseInt(a.date, 10)
    );
  }, [group]);

  const sortedIncomes = useMemo(() => {
    const incomes = group?.incomes || [];
    return [...incomes].sort(
      (a, b) => parseInt(b.date, 10) - parseInt(a.date, 10)
    );
  }, [group]);

  const transactionData =
    selectedTab === "Expense" ? sortedExpenses : sortedIncomes;

  const formatDate = (dateStr) => {
    const date = new Date(parseInt(dateStr, 10));
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Icon
        name={selectedTab === "Expense" ? "remove-circle" : "add-circle"}
        size={18}
        color={selectedTab === "Expense" ? "red" : "green"}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.sheetItem}>
          {item.name}: {FormatRupiah(item.amount)}
        </Text>
        <Text style={styles.sheetDate}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: "#F8DE7E" }}
    >
      <View style={styles.bottomSheetContent}>
        <View style={styles.tabContainer}>
          <TabButton
            label="Expense"
            selected={selectedTab}
            onPress={() => setSelectedTab("Expense")}
            icon="trending-up"
          />
          <TabButton
            label="Income"
            selected={selectedTab}
            onPress={() => setSelectedTab("Income")}
            icon="trending-down"
          />
        </View>
        <BottomSheetFlatList
          data={transactionData}
          keyExtractor={(item, index) =>
            item._id ? item._id : index.toString()
          }
          renderItem={renderItem}
        />
      </View>
    </BottomSheet>
  );
};

const TabButton = ({ label, selected, onPress, icon }) => (
  <TouchableOpacity
    style={[styles.tab, selected === label && styles.selectedTab]}
    onPress={onPress}
  >
    <Text
      style={[styles.tabText, selected === label && styles.selectedTabText]}
    >
      {label}
    </Text>
    <Icon
      name={icon}
      size={16}
      color={
        selected === label ? (label === "Expense" ? "red" : "green") : "black"
      }
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bottomSheetContent: { padding: 16 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#FFF0C2",
    borderRadius: 10,
    marginBottom: 10,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
  },
  selectedTab: { backgroundColor: "white" },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
    color: "black",
  },
  selectedTabText: { color: "black" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
  },
  sheetItem: { fontSize: 16 },
  sheetDate: { fontSize: 12, color: "gray" },
});

export default BottomSheetComponent;
