import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FormatRupiah } from "../utils/NumberFormat";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

export const GET_THIS_MONTH_INCOME_EXPENSES = gql`
  query GetThisMonthIncomesandExpenses($groupId: ID!) {
    getThisMonthIncomesandExpenses(groupId: $groupId) {
      _id
      name
      amount
      date
      type
      budgetId
    }
  }
`;

const UPDATE_INCOME = gql`
  mutation UpdateIncome(
    $updateIncomeId: ID!
    $groupId: ID!
    $amount: Float
    $name: String
  ) {
    updateIncome(
      id: $updateIncomeId
      groupId: $groupId
      amount: $amount
      name: $name
    ) {
      name
      amount
    }
  }
`;

const DELETE_INCOME = gql`
  mutation DeleteIncome($deleteIncomeId: ID!, $groupId: ID!) {
    deleteIncome(id: $deleteIncomeId, groupId: $groupId)
  }
`;

const UPDATE_EXPENSE = gql`
  mutation UpdateExpense(
    $updateExpenseId: ID!
    $name: String
    $amount: Float
    $budgetId: ID
  ) {
    updateExpense(
      id: $updateExpenseId
      name: $name
      amount: $amount
      budgetId: $budgetId
    ) {
      name
      amount
    }
  }
`;

const DELETE_EXPENSE = gql`
  mutation DeleteExpense($groupId: ID!, $expenseId: ID!) {
    deleteExpense(groupId: $groupId, expenseId: $expenseId) {
      _id
      name
      note
      amount
      date
      budgetId
    }
  }
`;

const TransactionList = ({ groupId, selectedBudgetId, budgets }) => {
  const { data, loading, error, refetch } = useQuery(
    GET_THIS_MONTH_INCOME_EXPENSES,
    {
      variables: { groupId },
      skip: !groupId,
    }
  );

  const [updateIncome] = useMutation(UPDATE_INCOME, {
    onCompleted: () => refetch(),
  });
  const [deleteIncome] = useMutation(DELETE_INCOME, {
    onCompleted: () => refetch(),
  });
  const [updateExpense] = useMutation(UPDATE_EXPENSE, {
    onCompleted: () => refetch(),
  });
  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onCompleted: () => refetch(),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  if (loading) return <Text>Loading...</Text>;
  // if (error) return <Text>Error: {error.message}</Text>;

  let allTransaction = data?.getThisMonthIncomesandExpenses || [];

  // Filter transactions by selected budget
  if (selectedBudgetId) {
    allTransaction =
      allTransaction?.filter((item) => item.budgetId === selectedBudgetId) ||
      [];
  }

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setName(transaction.name);
    setAmount(transaction.amount.toString());
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!selectedTransaction) return;

    try {
      if (selectedTransaction.type === "income") {
        await updateIncome({
          variables: {
            updateIncomeId: selectedTransaction._id,
            groupId,
            name,
            amount: parseFloat(amount),
          },
        });
      } else {
        await updateExpense({
          variables: {
            updateExpenseId: selectedTransaction._id,
            name,
            amount: parseFloat(amount),
            budgetId: selectedTransaction.budgetId || groupId,
          },
        });
      }

      Alert.alert("Success", "Transaction updated successfully.");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update transaction.");
    }
  };

  const handleDelete = async () => {
    if (!selectedTransaction) return;

    try {
      if (selectedTransaction.type === "income") {
        await deleteIncome({
          variables: { deleteIncomeId: selectedTransaction._id, groupId },
        });
      } else {
        await deleteExpense({
          variables: { expenseId: selectedTransaction._id, groupId },
        });
      }

      Alert.alert("Success", "Transaction deleted successfully.");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete transaction.");
    }
  };

  const currentMonth = new Date().getMonth();
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.expenseContainer}>
        <Text style={styles.expenseTitle}>
          {monthName[currentMonth]} {currentYear} Transactions
        </Text>
        {allTransaction.length === 0 ? (
          <Text style={styles.noDataText}>No transactions available</Text>
        ) : (
          allTransaction.map((item) => (
            <TouchableOpacity key={item._id} onPress={() => openModal(item)}>
              <View style={styles.expenseItem}>
                <Text style={styles.expenseItemName}>{item.name}</Text>
                <Text style={styles.expenseItemAmount}>
                  {FormatRupiah(item.amount)}
                </Text>
                <Icon
                  name={
                    item.type === "income" ? "arrow-downward" : "arrow-upward"
                  }
                  size={20}
                  color={item.type === "income" ? "green" : "red"}
                  style={styles.arrowIcon}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Transaction</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  expenseContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  expenseItemAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  arrowIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row", // Susun horizontal
    justifyContent: "space-between", // Rata ke samping
    width: "100%", // Penuhi lebar modal
    marginTop: 10,
  },
  button: {
    flex: 1, // Agar tombol sama besar
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5, // Beri sedikit jarak antar tombol
  },
  updateButton: {
    backgroundColor: "#102a71",
  },
  deleteButton: {
    backgroundColor: "#9109",
  },
  closeButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: "50%",
  },
});

export default TransactionList;
