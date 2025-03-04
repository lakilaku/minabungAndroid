import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { deleteSecure, getSecure } from "../utils/SecureStore";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";

const UPDATEPROFILE = gql`
  mutation UpdateProfile(
    $name: String
    $username: String
    $email: String
    $gender: String
    $profilePicture: Upload
    $birthDate: String
  ) {
    updateProfile(
      name: $name
      username: $username
      email: $email
      gender: $gender
      profilePicture: $profilePicture
      birthDate: $birthDate
    ) {
      _id
      name
      username
      email
      gender
      profilePicture
      birthDate
      groupId
    }
  }
`;

const ProfileScreen = () => {
  const { setIsSignedIn } = useContext(AuthContext);
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [updates, setUpdates] = useState({
    name: "",
    username: "",
    email: "",
    birthDate: "",
    gender: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userStr = await getSecure("userData");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        if (parsedUser._id) {
          setUser(parsedUser);
          setUpdates({
            name: parsedUser.name || "",
            username: parsedUser.username || "",
            email: parsedUser.email || "",
            birthDate: parsedUser.birthDate || "",
            gender: parsedUser.gender || "",
          });
        }
      }
    };
    const fetchToken = async () => {
      const storedToken = await getSecure("accessToken");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    fetchUserData();
    fetchToken();
  }, []);

  const [updateProfileMutation, { loading, error }] =
    useMutation(UPDATEPROFILE);

  const handleUpdateProfile = async () => {
    try {
      const { data } = await updateProfileMutation({
        variables: {
          name: updates.name,
          username: updates.username,
          email: updates.email,
          gender: updates.gender,
          birthDate: updates.birthDate,
          profilePicture: user.profilePicture, // Handle image upload later
        },
        context: {
          headers: { authorization: `Bearer ${token}` },
        },
      });
      setUser(data.updateProfile);
      setModalVisible(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.cover} />
        <Image
          source={{
            uri: user?.profilePicture || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
      </View>

      {/* User Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user?.name || "User Name"}</Text>
        <Text style={styles.username}>
          {user?.username ? "@" + user.username : "@username"}
        </Text>
        <Text style={styles.infoText}>
          Email: {user?.email || "email@example.com"}
        </Text>
        <Text style={styles.infoText}>Gender: {user?.gender || "N/A"}</Text>
        <Text style={styles.infoText}>
          Birth Date: {user?.birthDate || "N/A"}
        </Text>
      </View>

      {/* Options Buttons */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Choose Themes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>General Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: "#f52d56" }]}
          onPress={async () => {
            await deleteSecure("accessToken");
            await deleteSecure("userData");
            await deleteSecure("groupData");
            setIsSignedIn(false);
          }}
        >
          <Text style={[styles.optionText, { color: "#fff" }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder={user?.name || "Name"}
              value={updates.name}
              onChangeText={(text) => setUpdates({ ...updates, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder={user?.username || "Username"}
              value={updates.username}
              onChangeText={(text) =>
                setUpdates({ ...updates, username: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder={user?.email || "Email"}
              value={updates.email}
              onChangeText={(text) => setUpdates({ ...updates, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder={user?.birthDate || "Birth Date"}
              value={updates.birthDate}
              onChangeText={(text) =>
                setUpdates({ ...updates, birthDate: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder={user?.gender || "Gender"}
              value={updates.gender}
              onChangeText={(text) => setUpdates({ ...updates, gender: text })}
            />
            {/* Profile Picture Upload later */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {error && (
              <Text style={{ color: "red", marginTop: 10 }}>
                Error updating profile
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F7",
  },
  header: {
    height: 200,
    backgroundColor: "#FFC067",
    position: "relative",
  },
  cover: {
    flex: 1,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    position: "absolute",
    bottom: -60,
    left: 20,
  },
  infoContainer: {
    marginTop: 80,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
  },
  optionsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#102A71",
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
