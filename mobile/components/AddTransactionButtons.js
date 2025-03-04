import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { gql, useMutation } from "@apollo/client";

const ADD_BUDGET = gql`
  mutation AddBudget(
    $groupId: ID!
    $name: String!
    $limit: Float!
    $color: String
    $icon: String
  ) {
    addBudget(
      groupId: $groupId
      name: $name
      limit: $limit
      color: $color
      icon: $icon
    ) {
      name
      limit
      icon
      color
    }
  }
`;

const COLOR_OPTIONS = [
  "#3498db",
  "#e74222",
  "#2ecc71",
  "#f5c400",
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

const AddTransactionButtons = ({ groupId, navigation, refetch }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgetColor, setBudgetColor] = useState("#3498db");
  const [budgetIcon, setBudgetIcon] = useState("attach_money");

  const [addBudget, { loading, error }] = useMutation(ADD_BUDGET, {
    onCompleted: () => {
      refetch();
      Alert.alert("Success", "Budget added successfully!");
      setModalVisible(false);
      setBudgetName("");
      setBudgetLimit("");
      setBudgetColor("#3498db");
      setBudgetIcon("attach_money");
    },
    onError: (err) => {
      Alert.alert("Error", err.message);
    },
  });

  const handleAddBudget = () => {
    if (!budgetName || !budgetLimit) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (budgetName.length > 15) {
      Alert.alert("Error", "Name must be less than 15 characters");
      return;
    }
    addBudget({
      variables: {
        groupId,
        name: budgetName,
        limit: parseFloat(budgetLimit),
        color: budgetColor,
        icon: budgetIcon,
      },
    });
  };

  const formatRupiah = (value) => {
    if (!value) return "Rp.";
    return (
      "Rp." + parseFloat(value.replace(/\D/g, "") || 0).toLocaleString("id-ID")
    );
  };

  const parseNumber = (formattedValue) => {
    return formattedValue.replace(/\D/g, "");
  };

  return (
    <View style={styles.buttonContainer}>
      {/* Tombol Add Transaction */}
      <TouchableOpacity
        style={[styles.addButton, styles.addIncomeButton]}
        onPress={() => navigation.navigate("Add")}
      >
        <Text style={styles.buttonText}>Transaction</Text>
        <View style={styles.iconCircleGreen}>
          <Icon name="add" size={24} color="white" />
        </View>
      </TouchableOpacity>

      {/* Tombol Add Budget */}
      <TouchableOpacity
        style={[styles.addButton, styles.addExpenseButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Budget</Text>
        <View style={styles.iconCircleGreen}>
          <Icon name="add" size={24} color="white" />
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Budget</Text>

            <TextInput
              style={styles.input}
              placeholder="Budget Name"
              value={budgetName}
              onChangeText={setBudgetName}
            />
            <TextInput
              style={styles.input}
              placeholder="Limit Amount"
              keyboardType="numeric"
              value={formatRupiah(budgetLimit)}
              onChangeText={(text) => setBudgetLimit(parseNumber(text))}
            />

            <Text style={styles.label}>Choose Color:</Text>
            <View style={styles.colorContainer}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    budgetColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setBudgetColor(color)}
                />
              ))}
            </View>

            <Text style={styles.label}>Choose Icon:</Text>
            <ScrollView horizontal>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setBudgetIcon(icon)}
                  style={[
                    styles.iconOption,
                    budgetIcon === icon && styles.selectedIcon,
                  ]}
                >
                  <Icon
                    name={icon}
                    size={32}
                    color={budgetIcon === icon ? "black" : "gray"}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddBudget}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Saving..." : "Add Budget"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addIncomeButton: {
    marginRight: 8,
  },
  addExpenseButton: {
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginRight: 10,
  },
  iconCircleGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  colorContainer: { flexDirection: "row", marginBottom: 15 },
  colorOption: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 5 },
  selectedColor: { borderWidth: 2, borderColor: "black" },
  submitButton: {
    backgroundColor: "#102a71",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  iconOption: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIcon: {
    backgroundColor: "#ddd",
  },
});

export default AddTransactionButtons;
