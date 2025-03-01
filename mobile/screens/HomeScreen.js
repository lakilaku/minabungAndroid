import { View, Text, StyleSheet } from "react-native";

const HomeScreen = () => {
  return (
    <View style={styles.topContainer}>
      <Text style={styles.subTitle}>Balance</Text>
      <Text style={styles.title}>Rp.10.000.000</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: "top",
    marginTop: 40,
    padding: 20,
    backgroundColor: "#F4F6F7",
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

export default HomeScreen;
