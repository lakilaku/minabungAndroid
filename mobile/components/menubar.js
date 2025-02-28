import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const MenuBar = ({ navigation }) => {
  const [activeIcon, setActiveIcon] = useState("Overview");

  const handleIconPress = (iconName, screenName) => {
    setActiveIcon(iconName);
    if (navigation && screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIcon === "home" && styles.activeIcon,
        ]}
        onPress={() => handleIconPress("home", "Home")}
      >
        <Icon
          name="home"
          size={30}
          color={activeIcon === "home" ? "#ffffff" : "#000"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIcon === "menu" && styles.activeIcon,
        ]}
        onPress={() => handleIconPress("menu", "Budget")}
      >
        <Icon
          name="menu"
          size={30}
          color={activeIcon === "menu" ? "#ffffff" : "#000"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIcon === "add" && styles.activeIcon,
        ]}
        onPress={() => handleIconPress("add", "Add")}
      >
        <Icon
          name="add"
          size={30}
          color={activeIcon === "add" ? "#ffffff" : "#000"}
        />
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIcon === "Email" && styles.activeIcon,
        ]}
        onPress={() => handleIconPress("Email")}
      >
        <Icon
          name="email"
          size={30}
          color={activeIcon === "Email" ? "#ffffff" : "#000"}
        />
      </TouchableOpacity> */}
      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIcon === "person" && styles.activeIcon,
        ]}
        onPress={() => handleIconPress("person", "Profile")}
      >
        <Icon
          name="person"
          size={30}
          color={activeIcon === "person" ? "#ffffff" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 30,
    // Shadow for iOS
    shadowColor: "#2C6D9E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
  iconContainer: {
    padding: 10,
  },
  activeIcon: {
    backgroundColor: "#4285F4",
    borderRadius: 25,
    padding: 10,
  },
});

export default MenuBar;
