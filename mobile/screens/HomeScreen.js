import React, { useEffect, useState } from "react";
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
import { getSecure } from "../utils/SecureStore";
import { gql, useQuery } from "@apollo/client";
import { FormatRupiah } from "../utils/NumberFormat";
import AddTransactionButtons from "../components/AddTransactionButtons";
import AddGroup from "../components/AddGroup";
import { useNavigation } from "@react-navigation/native";

const GET_GROUP_BY_USER_ID = gql`
  query GetGroupByUserId($userId: ID!) {
    getGroupByUserId(userId: $userId) {
      _id
      name
      description
      budgets {
        _id
        name
        limit
        color
        icon
      }
      members {
        name
      }
      incomes {
        name
        amount
      }
      expenses {
        name
        amount
      }
    }
  }
`;

const HomeScreen = () => {
  const [userId, setUserId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Fetch user data on mount.
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getSecure("userData");
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser._id) {
          setUserId(parsedUser._id);
        }
      }
    };
    fetchUserData();
  }, []);

  // Run the query regardless of early returns.
  const { data, loading, error, refetch } = useQuery(GET_GROUP_BY_USER_ID, {
    variables: { userId },
    skip: !userId,
  });

  // Compute groupList unconditionally.
  const groupList = data?.getGroupByUserId || [];

  // Set a default group if none is selected.
  useEffect(() => {
    if (groupList.length > 0 && !selectedGroup) {
      setSelectedGroup(groupList[0]);
    }
  }, [groupList, selectedGroup]);

  // Conditional returns can come after all hooks are declared.
  if (!userId || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const budgets = selectedGroup?.budgets || [];
  const incomes = selectedGroup?.incomes || [];
  const totalIncome = incomes.reduce(
    (acc, income) => acc + (income.amount || 0),
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.incomeContainer}>
        <Text style={styles.incomeTitle}>Income</Text>
        <Text style={styles.incomeAmount}>{FormatRupiah(totalIncome)}</Text>
      </View>

      <BudgetList targetData={budgets} />

      <AddTransactionButtons
        navigation={navigation}
        groupId={selectedGroup?._id}
        refetch={refetch}
      />

      {/* Group container opens the modal */}
      <TouchableOpacity
        style={styles.groupContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.groupTitle}>Group</Text>
        <Text style={styles.groupName}>{selectedGroup?.name}</Text>
      </TouchableOpacity>

      <TransactionList groupId={selectedGroup?._id} />

      {/* Modern styled Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Group</Text>
            {groupList.map((group) => (
              <TouchableOpacity
                key={group._id}
                onPress={() => {
                  setSelectedGroup(group);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalGroupName}>{group.name}</Text>
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
    backgroundColor: "#FFC067",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  incomeContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  incomeTitle: {
    fontSize: 18,
    color: "#333",
  },
  incomeAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  groupContainer: {
    backgroundColor: "#102A71",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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
    paddingVertical: 10,
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
