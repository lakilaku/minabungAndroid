import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/MaterialIcons";

const BottomSheetComponent = ({ bottomSheetRef, snapPoints }) => {
  const [selectedTab, setSelectedTab] = useState("Expense");

  const transactionData =
    selectedTab === "Expense"
      ? [
          { key: "Food: $500" },
          { key: "Rent: $1200" },
          { key: "Transport: $300" },
          { key: "Shopping: $200" },
        ]
      : [
          { key: "Salary: $5000" },
          { key: "Freelance: $1500" },
          { key: "Investments: $200" },
        ];

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
      <View style={styles.bottomSheetContent}>
        {/* Tab Selector */}
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

        {/* List of Transactions */}
        <BottomSheetFlatList
          data={transactionData}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Icon
                name={
                  selectedTab === "Expense" ? "remove-circle" : "add-circle"
                }
                size={18}
                color={selectedTab === "Expense" ? "red" : "green"}
              />
              <Text style={styles.sheetItem}>{item.key}</Text>
            </View>
          )}
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
    backgroundColor: "#F9D976",
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
  tabText: { fontSize: 16, fontWeight: "bold", marginRight: 5, color: "black" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
  },
  sheetItem: { fontSize: 16, marginLeft: 10 },
});

export default BottomSheetComponent;
