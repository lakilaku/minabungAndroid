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
import { deleteSecure, getSecure, saveSecure } from "../utils/SecureStore";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { lookup } from "react-native-mime-types";
import { ReactNativeFile } from "apollo-upload-client";
import DateTimePicker from "@react-native-community/datetimepicker";

const UPDATEPROFILE = gql`
  mutation UpdateProfile(
    $name: String
    $username: String
    $email: String
    $birthDate: String
  ) {
    updateProfile(
      name: $name
      username: $username
      email: $email
      birthDate: $birthDate
    ) {
      _id
      name
      username
      email
      birthDate
      groupId
      profilePicture
    }
  }
`;

const GET_GROUP_BY_USER_ID = gql`
  query GetGroupByUserId($userId: ID!) {
    getGroupByUserId(userId: $userId) {
      name
    }
  }
`;

const UPDATE_PROFILE_PICTURE = gql`
  mutation UpdateProfilePicture($profilePicture: Upload!) {
    updateProfilePicture(profilePicture: $profilePicture) {
      message
      profilePicture
    }
  }
`;

const ProfileScreen = () => {
  const { setIsSignedIn } = useContext(AuthContext);
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblePicture, setModalVisiblePicture] = useState(false);
  const [updateProfilePicture] = useMutation(UPDATE_PROFILE_PICTURE);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  // console.log(user);
  
  const [updates, setUpdates] = useState({
    name: "",
    username: "",
    email: "",
    birthDate: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userStr = await getSecure("userData");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        // console.log(parsedUser, "<<<");
        
        if (parsedUser._id) {
          setUser(parsedUser);
          setUpdates({
            name: parsedUser.name || "",
            username: parsedUser.username || "",
            email: parsedUser.email || "",
            birthDate: parsedUser.birthDate || "",
            profilePicture: parsedUser.profilePicture || "",
          });
        }
      }
    };
    const fetchToken = async () => {
      const storedToken = await getSecure("accessToken");
      if (storedToken) {
        setToken(storedToken);
        // console.log(token);
      }
    };
    fetchUserData();
    fetchToken();
  }, []);

  const userId = user?._id;

  const { data: userData } = useQuery(GET_GROUP_BY_USER_ID, {
    variables: { userId },
    skip: !userId,
  });

  // console.log(userData?.getGroupByUserId.length);
  

  const [updateProfileMutation, { loading, error }] =
    useMutation(UPDATEPROFILE);

  const handleUpdateProfile = async () => {
    try {
      const { data } = await updateProfileMutation({
        variables: {
          name: updates.name,
          username: updates.username,
          email: updates.email,
          birthDate: updates.birthDate,
        },
        context: {
          headers: { authorization: `Bearer ${token}` },
        },
      });
      if (data?.updateProfile) {
        setUser(data.updateProfile);
  
        await saveSecure("userData", JSON.stringify(data.updateProfile));
  
        setModalVisible(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileType = lookup(uri) || "image/jpeg";
      const fileName = uri.split("/").pop();
      
      // Mengonversi menjadi ReactNativeFile
      const file = new ReactNativeFile({
        uri,
        type: fileType,
        name: fileName,
      });
  
      try {
        const { data } = await updateProfilePicture({
          variables: {
            profilePicture: file, // Kirim file yang benar
          },
          context: { headers: { authorization: `Bearer ${token}` } },
        });
  
        if (data?.updateProfilePicture) {
          setUser((prev) => ({
            ...prev,
            profilePicture: data.updateProfilePicture.profilePicture,
          }));
          setModalVisiblePicture(false);
        }
      } catch (err) {
        console.error("Error updating profile picture:", err);
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setUpdates({ ...updates, birthDate: selectedDate.toISOString().split("T")[0] }); // Format YYYY-MM-DD
    }
  };
  // console.log(user);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.cover} />
        <TouchableOpacity onPress={() => setModalVisiblePicture(true)}>
          <Image
            source={{
              uri: user?.profilePicture || `https://image.pollinations.ai/prompt/${user?.name} 1 berupa wajah?width=800&height=800&nologo=true`,
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)} // Buka modal edit
      >
        <Icon name="edit" size={24} color="#fff" />
      </TouchableOpacity>
      {/* <Text style={styles.edit}>Edit Profile</Text> */}
      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
          await deleteSecure("accessToken");
          setIsSignedIn(false);
        }}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* User Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user?.name || "User Name"}</Text>
        <Text style={styles.username}>
          {user?.username ? "@️" + user.username : "@username"}
        </Text>
        <Text style={styles.infoText}>
        📧 Email: {user?.email || "email@example.com"}
        </Text>
        {/* <Text style={styles.infoText}>Gender: {user?.gender || "N/A"}</Text> */}
        <Text style={styles.infoText}>
        📆 Birth Date: {user?.birthDate || "N/A"}
        </Text>
        <View style={styles.separator} />
        <View style={styles.textCenter}>
            <Text style={styles.textSmall}>Group</Text>
            <Text style={styles.textCounter}>{userData?.getGroupByUserId.length}</Text>
        </View>
        <View style={styles.separator} />
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
        {/* <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: "#f52d56" }]}
          onPress={async () => {
            await deleteSecure("accessToken");
            await deleteSecure("userData");
            await deleteSecure("groupData");
            setIsSignedIn(false);
          }}
        >
          <Text style={[styles.optionText, { color: "#fff" }]}>Logout</Text>
        </TouchableOpacity> */}
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
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{updates.birthDate || "Select Birth Date"}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={updates.birthDate ? new Date(updates.birthDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
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

      {/* Modal for Image Selection */}
      <Modal visible={modalVisiblePicture} transparent={true} animationType="slide">
        <View style={uploadPictureStyles.modalOverlayPicture}>
          <View style={uploadPictureStyles.modalContentPicture}>
            <Text style={uploadPictureStyles.modalTitlePicture}>Update Profile Picture</Text>

            {/* <TouchableOpacity 
              style={[uploadPictureStyles.modalButtonPicture, uploadPictureStyles.confirmButtonPicture]} 
              onPress={handleChoosePhoto}>
              <Text style={uploadPictureStyles.modalButtonTextPicture}>Choose from Gallery</Text>
            </TouchableOpacity> */}

            <View style={uploadPictureStyles.buttonContainerPicture}>
              <TouchableOpacity
                style={[uploadPictureStyles.modalButtonPicture, uploadPictureStyles.confirmButtonPicture]}
                onPress={handleChoosePhoto}
              >
                <Text style={uploadPictureStyles.modalButtonTextPicture}>Upload Picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[uploadPictureStyles.modalButtonPicture, uploadPictureStyles.cancelButtonPicture]}
                onPress={() => setModalVisiblePicture(false)}
              >
                <Text style={uploadPictureStyles.modalButtonTextPicture}>Cancel</Text>
              </TouchableOpacity>

            </View>

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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  logoutButton: {
    position: "absolute",
    top: 210, // Sesuaikan dengan posisi yang diinginkan
    right: 20, // Letakkan di pojok kanan atas
    backgroundColor: "#f52d56",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 3, // Tambahkan shadow untuk tampilan lebih baik
  },
  
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  editButton: {
    position: "absolute",
    top: 20, // Atur posisi vertikal
    right: 20, // Pojok kanan atas
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Warna transparan agar lebih estetik
    padding: 10,
    borderRadius: 50, // Biar bentuknya bulat
    elevation: 3, // Tambahkan shadow (hanya untuk Android)
  },
  edit: {
    position: "absolute",
    top: 55, // Atur posisi vertikal
    right: 20, // Pojok kanan atas
    padding: 10,
  },
  textCenter: {
    alignItems: "center",
  },
  textSmall: {
      fontSize: 14,
      opacity: 0.5,
  },
  textCounter: {
      fontSize: 16,
      fontWeight: "bold",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#D3D3D3',
    marginTop: 16,
  },
});

const uploadPictureStyles = StyleSheet.create({
  modalOverlayPicture: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentPicture: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitlePicture: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtonPicture: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  modalButtonTextPicture: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonContainerPicture: {
    flexDirection: "row", // Membuat tombol sejajar kiri-kanan
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  cancelButtonPicture: {
    backgroundColor: "#ccc",
    flex: 1,
    marginLeft: 5,
  },
  confirmButtonPicture: {
    backgroundColor: "#102A71",
    flex: 1,
    marginRight: 5,
  },
});

export default ProfileScreen;
