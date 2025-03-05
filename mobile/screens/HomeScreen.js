import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import TransactionList from "../components/TransactionList";
import BudgetList from "../components/BudgetList";
import { deleteSecure, getSecure, saveSecure } from "../utils/SecureStore";
import { gql, useQuery } from "@apollo/client";
import { FormatRupiah } from "../utils/NumberFormat";
import AddTransactionButtons from "../components/AddTransactionButtons";
import AddGroup from "../components/AddGroup";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export const GET_GROUP_BY_USER_ID = gql`
  query GetGroupByUserId($userId: ID!) {
    getGroupByUserId(userId: $userId) {
      _id
      name
      invite
      budgets {
        _id
        name
        limit
        color
        icon
      }
      incomes {
        name
        amount
        date
      }
      expenses {
        name
        amount
        date
        budgetId
      }
    }
  }
`;

const HomeScreen = () => {
  const [userId, setUserId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getSecure("userData");
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser._id) setUserId(parsedUser._id);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchStoredGroup = async () => {
      const storedGroup = await getSecure("selectedGroup");
      if (storedGroup) setSelectedGroup(JSON.parse(storedGroup));
    };
    fetchStoredGroup();
  }, [data]);

  const { data, loading, error, refetch } = useQuery(GET_GROUP_BY_USER_ID, {
    variables: { userId },
    skip: !userId,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      setSelectedGroup(null);
      // console.log(selectedIndex, "Selected Index Focus");
    }, [refetch, selectedIndex])
  );

  const groupList = data?.getGroupByUserId || [];
  useEffect(() => {
    if (groupList.length > 0 && !selectedGroup) {
      const defaultGroup = groupList[selectedIndex];
      setSelectedGroup(defaultGroup);
      // console.log(selectedIndex, "Selected Index Inside");
      // console.log(defaultGroup.name);
      saveSecure("selectedGroup", JSON.stringify(defaultGroup));
      console.log("Masuk", defaultGroup.budgets);
    }
  }, [groupList, selectedGroup, data]);

  if (!userId || loading)
    return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  const budgets = selectedGroup?.budgets || [];
  const incomes = selectedGroup?.incomes || [];
  const expenses = selectedGroup?.expenses || [];

  const totalIncome = incomes.reduce(
    (acc, income) => acc + (income.amount || 0),
    0
  );
  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + (expense.amount || 0),
    0
  );
  const currentBalance = totalIncome - totalExpenses;

  const handleBudgetClick = (budgetId) => {
    setSelectedBudgetId((prevBudgetId) =>
      prevBudgetId === budgetId ? null : budgetId
    );
  };

  const filteredExpenses = selectedBudgetId
    ? expenses.filter((expense) => expense.budgetId === selectedBudgetId)
    : [];

  const filteredIncomes = selectedBudgetId ? incomes : [];

  const filteredTransactions = [...filteredIncomes, ...filteredExpenses];

  filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <View style={styles.container}>
      <View style={styles.incomeContainer}>
        <Text style={styles.incomeTitle}>Current Balance</Text>
        <Text style={styles.incomeAmount}>{FormatRupiah(currentBalance)}</Text>
      </View>
      <BudgetList
        budgets={budgets}
        expenses={expenses}
        onBudgetClick={handleBudgetClick}
        selectedBudgetId={selectedBudgetId}
        setSelectedBudgetId={setSelectedBudgetId}
        refetch={refetch}
        setSelectedGroup={setSelectedGroup}
      />
      <AddTransactionButtons
        navigation={navigation}
        groupId={selectedGroup?._id}
        refetch={refetch}
        setSelectedGroup={setSelectedGroup}
      />
      <TouchableOpacity
        style={styles.groupContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.groupTitle}>Group</Text>
        <Text style={styles.groupName}>{selectedGroup?.name}</Text>
      </TouchableOpacity>
      <TransactionList
        groupId={selectedGroup?._id}
        selectedBudgetId={selectedBudgetId}
        budgets={budgets}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Group</Text>
            {groupList.map((group, index) => (
              <TouchableOpacity
                key={group._id}
                onPress={() => {
                  setSelectedGroup(group);
                  setSelectedIndex(index);
                  saveSecure("selectedGroup", JSON.stringify(group));
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalGroupName}>{group.name}</Text>
                <Text style={styles.modalGroupDescription}>
                  Invite Code: {group.invite}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.createJoinButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("AddGroup");
              }}
            >
              <Text style={styles.createJoinButtonText}>Create/Join Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8DE7E",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  incomeContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  incomeTitle: {
    fontSize: 15,
    color: "#333",
  },
  incomeAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  groupContainer: {
    backgroundColor: "#102A71",
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 10,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  groupName: {
    fontSize: 16,
    paddingTop: 2,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  modalGroupName: {
    fontSize: 18,
    color: "#555",
    paddingTop: 10,
  },
  modalGroupDescription: {
    fontSize: 14,
    color: "#777",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#eaeaea",
  },
  createJoinButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#FFC067",
    alignItems: "center",
  },
  createJoinButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#676765",
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFC067",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFC067",
  },
});

export default HomeScreen;
