import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { deleteSecure } from "../utils/SecureStore";
import { AuthContext } from "../contexts/AuthContext";

const ProfileScreen = () => {
  const { setIsSignedIn } = useContext(AuthContext);
  return (
    <View style={styles.topContainer}>
      <Text>Profile Screen</Text>
      <TouchableOpacity
        style={{
          borderRadius: 20,
          backgroundColor: "#f52d56",
          paddingHorizontal: 15,
          paddingVertical: 5,
        }}
        onPress={async () => {
          await deleteSecure("accessToken");
          setIsSignedIn(false);
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 40,
    padding: 20,
    backgroundColor: "#F4F6F7",
  },
});

export default ProfileScreen;
