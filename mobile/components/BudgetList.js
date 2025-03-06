import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert, // Import Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FormatRupiah } from "../utils/NumberFormat";
import Modal from "react-native-modal";
import { gql, useMutation } from "@apollo/client";

const UPDATE_BUDGET = gql`
  mutation UpdateBudget(
    $updateBudgetId: ID!
    $name: String
    $limit: Float
    $icon: String
    $color: String
  ) {
    updateBudget(
      id: $updateBudgetId
      name: $name
      limit: $limit
      icon: $icon
      color: $color
    ) {
      _id
      name
      limit
      icon
      color
    }
  }
`;

const DELETE_BUDGET = gql`
  mutation DeleteBudget($deleteBudgetId: ID!) {
    deleteBudget(id: $deleteBudgetId) {
      _id
    }
  }
`;

const COLOR_OPTIONS = [
  "#3498db",
  "#e74222",
  "#2ecc71",
  "#ff4d91",
  "#9b59b6",
  "#34495e",
];
const ICON_OPTIONS = [
  "restaurant",
  "shopping-cart",
  "attach-money",
  "wallet",
  "car-rental",
  "card-giftcard",
  "local-hospital",
  "home",
  "school",
  "flight",
  "subscriptions",
  "movie",
  "fitness-center",
  "pets",
  "child-care",
  "house-siding",
  "lightbulb",
  "gas-meter",
  "water-drop",
  "trending-up",
  "savings",
  "luggage",
  "celebration",
  "handyman",
  "diversity-3",
  "workspace-premium",
  "security",
  "groups",
  "volunteer-activism",
  "delivery-dining",
  "liquor",
  "local-bar",
];

const BudgetList = ({
  budgets,
  expenses,
  onBudgetClick,
  selectedBudgetId,
  refetch,
  setSelectedGroup,
  setSelectedBudgetId,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");

  const [updateBudget] = useMutation(UPDATE_BUDGET);
  const [deleteBudget] = useMutation(DELETE_BUDGET);

  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setName(budget.name);
    setLimit(String(budget.limit));
    setIcon(budget.icon);
    setColor(budget.color);
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  const handleUpdate = async () => {
    try {
      await updateBudget({
        variables: {
          updateBudgetId: selectedBudget._id,
          name,
          limit: parseFloat(limit),
          icon,
          color,
        },
      });
      await refetch(); // Penting: Memastikan data di-refresh setelah update
      setSelectedGroup(null);
      setSelectedBudgetId(null);
      closeEditModal();
      Alert.alert("Success", "Budget updated successfully.");
    } catch (error) {
      console.error("Error updating budget:", error);
      Alert.alert("Error", "Failed to update budget.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBudget({
        variables: { deleteBudgetId: selectedBudget._id },
      });
      await refetch(); // Penting: Memastikan data di-refresh setelah delete
      setSelectedGroup(null);
      setSelectedBudgetId(null);
      setModalVisible(false);
      Alert.alert("Success", "Budget deleted successfully.");
    } catch (error) {
      console.error("Error deleting budget:", error);
      Alert.alert("Error", "Failed to delete budget.");
    }
  };

  const formatNumberWithDot = (num) => {
    if (isNaN(num)) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (formattedValue) => {
    return formattedValue.replace(/\D/g, "");
  };
  const formatRupiah = (value) => {
    if (!value) return "Rp.";
    return (
      "Rp." + parseFloat(value.replace(/\D/g, "") || 0).toLocaleString("id-ID")
    );
  };

  const renderBudgetItem = ({ item }) => {
    const totalExpense = expenses
      .filter((expense) => expense.budgetId === item._id)
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);

    const availableBudget = item.limit - totalExpense;
    const isSelected = selectedBudgetId === item._id;

    return (
      <TouchableOpacity
        onPress={() => onBudgetClick(item._id)}
        style={[
          styles.budgetCard,
          {
            backgroundColor: item.color,
            borderWidth: selectedBudgetId === item._id ? 3 : 0,
            borderColor:
              selectedBudgetId === item._id ? "#FFD700" : "transparent",
            opacity:
              selectedBudgetId === null || selectedBudgetId === item._id
                ? 1
                : 0.5,
          },
        ]}
      >
        <Icon
          name={item.icon || "help-outline"}
          size={30}
          color="#ffffff"
          style={styles.icon}
        />
        {isSelected && (
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={styles.editIconContainer}
          >
            <Icon name="edit" size={16} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.budgetCardAmount}>
          <Text style={availableBudget <= 0 ? styles.availableRed : {}}>
            {FormatRupiah(availableBudget)}
          </Text>
          <View style={styles.limitContainer}>
            <Text style={styles.limitText}>
              {" / "}
              {formatNumberWithDot(item.limit)}
            </Text>
          </View>
        </Text>
        <Text style={styles.budgetCardLabel}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.budgetContainer}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetTitle}>Budgets</Text>
      </View>
      <FlatList
        data={budgets}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item._id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.budgetList}
      />

      {/* Modal Edit Budget */}
      <Modal isVisible={modalVisible} onBackdropPress={closeEditModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Budget"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Limit Budget"
            value={formatRupiah(limit)}
            onChangeText={(text) => setLimit(parseNumber(text))}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Choose Color:</Text>
          <View style={styles.colorPickerContainer}>
            <FlatList
              data={COLOR_OPTIONS}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.colorBox,
                    {
                      backgroundColor: item,
                      borderWidth: color === item ? 3 : 0,
                    },
                  ]}
                  onPress={() => setColor(item)}
                />
              )}
            />
          </View>
          <Text style={styles.label}>Choose Icon:</Text>
          <View style={styles.iconPickerContainer}>
            <FlatList
              data={ICON_OPTIONS}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iconBox,
                    { backgroundColor: icon === item ? "#ddd" : "transparent" },
                  ]}
                  onPress={() => setIcon(item)}
                >
                  <Icon name={item} size={24} color="#000" />
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleUpdate} style={styles.button}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeEditModal}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  budgetContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  budgetList: {
    paddingVertical: 10,
  },
  budgetCard: {
    width: 150,
    // height: 100,
    borderRadius: 16,
    marginRight: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 6,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 10,
    // // position: "absolute",
    // top: 10,
    // right: 10,
    zIndex: 1,
  },
  budgetCardAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    // position: "absolute",
    // bottom: 10,
    // right: 10,
    // paddingBottom: 5,
  },
  availableRed: {
    color: "red",
  },
  limitContainer: {
    alignItems: "flex-end",
    paddingLeft: 20,
  },
  limitText: {
    color: "#fff",
    textAlign: "right",
    fontSize: 14,
  },
  budgetCardLabel: {
    fontSize: 14,
    color: "#fff",
    // position: "absolute",
    // bottom: 5,
    // right: 10,
    width: "100%",
    textAlign: "right",
    marginBottom: 8,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 5,
    borderRadius: 8,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#102a71",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#9109",
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  colorPickerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  colorBox: {
    width: 40,
    height: 40,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  iconPickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  iconBox: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default BudgetList;
