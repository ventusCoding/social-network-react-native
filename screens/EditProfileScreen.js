import React, { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Button, Snackbar } from "react-native-paper";

import * as ImagePicker from "expo-image-picker";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import FormButton from "../components/FormButton";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import firebaseApp from "firebase/app";
import * as firebase from "firebase";
import "firebase/auth";

import RBSheet from "react-native-raw-bottom-sheet";
import ChoosePhotoButton from "../components/ChoosePhotoButton";

import { windowHeight } from "../utils/Dimentions";

import Spinner from "react-native-loading-spinner-overlay";

// create a component
const EditProfileScreen = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const [image, setImage] = useState(null);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [phone, setPhone] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();

  const [snackBarMsg, setSnackBarMsg] = useState("");

  const refRBSheet = useRef();

  useEffect(async () => {
    if (Platform.OS !== "web") {
      const { GalleryPermissionStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (GalleryPermissionStatus !== "granted") {
        //alert("Permission denied");
      }
      const { CameraPermissionStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (CameraPermissionStatus !== "granted") {
        //alert("Permission denied");
      }
    }
  }, []);

  const takePhotoFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      const manipResult = await manipulateAsync(
        result.uri,
        [{ resize: { width: 500 } }],
        {
          compress: 0.4,
          format: SaveFormat.PNG,
        }
      );

      setImage(manipResult.uri);
      refRBSheet.current.close();
    }
  };

  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const manipResult = await manipulateAsync(
        result.uri,
        [{ resize: { width: 500 } }],
        {
          compress: 0.02,
          format: SaveFormat.PNG,
        }
      );

      setImage(manipResult.uri);

      refRBSheet.current.close();
    }
  };

  const getPictureBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
  };

  useEffect(() => {
    firebaseApp
      .database()
      .ref("users")
      .child(firebaseApp.auth().currentUser.uid)
      .once("value", (snapshot) => {
        setUser(snapshot.val());
        setLoading(false);
      });
  }, []);

  const updateProfil = async () => {
    let newUser = {};

    if (image) {
      setLoading(true);

      let blob;
      try {
        blob = await getPictureBlob(image);
        const ref = await firebase
          .storage()
          .ref()
          .child(`users/${firebaseApp.auth().currentUser.uid}`);
        const snapshot = await ref.put(blob);
        const downloadUrlResult = await snapshot.ref.getDownloadURL();

        newUser.image = downloadUrlResult;
      } catch (e) {
        setLoading(false);
        setSnackBarMsg(e.message);
        setVisible(true);
      } finally {
        blob.close();
      }
    }

    if (name) {
      newUser.name = name;
    }

    if (description) {
      newUser.description = description;
    }

    if (phone) {
      newUser.phoneNumber = phone;
    }

    if (city) {
      newUser.city = city;
    }

    if (country) {
      newUser.country = country;
    }

    if (Object.keys(newUser).length === 0) {
      setSnackBarMsg("You Need To change Something To Update.");
      setVisible(true);
      return;
    }

    updateUser(newUser);
    setLoading(false);
    setSnackBarMsg("Success!", "saved successfully");
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      <View style={{ marginHorizontal: 20 }}>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageBackground
                source={{
                  uri: image ? image : user.image,
                }}
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 70 }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            {user.name}
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color="#333333" size={20} />
          <TextInput
            placeholder="Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            defaultValue={user.name}
            onChangeText={(txt) => {
              setName(txt);
            }}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <Ionicons name="ios-clipboard-outline" color="#333333" size={20} />
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="About Me"
            placeholderTextColor="#666666"
            defaultValue={user.description}
            onChangeText={(txt) => {
              setDescription(txt);
            }}
            autoCorrect={true}
            style={[styles.textInput, { height: 40 }]}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color="#333333" size={20} />
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            defaultValue={user.phoneNumber}
            onChangeText={(txt) => {
              setPhone(txt);
            }}
            style={styles.textInput}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name="globe" color="#333333" size={20} />
          <TextInput
            placeholder="Country"
            placeholderTextColor="#666666"
            autoCorrect={false}
            defaultValue={user.country}
            onChangeText={(txt) => {
              setCountry(txt);
            }}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            color="#333333"
            size={20}
          />
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            autoCorrect={false}
            defaultValue={user.city}
            onChangeText={(txt) => {
              setCity(txt);
            }}
            style={styles.textInput}
          />
        </View>
        <FormButton buttonTitle="Update" onPress={updateProfil} />
      </View>

      <RBSheet
        ref={refRBSheet}
        dragFromTopOnly={true}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={windowHeight / 3.5}
        customStyles={{
          container: {
            backgroundColor: "#fff",
            alignItems: "center",
            display: "flex",
            borderTopEndRadius: 25,
            borderTopStartRadius: 25,
          },
          wrapper: {
            backgroundColor: "rgba(0,0,0,.6)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <ChoosePhotoButton
          buttonTitle="Take Photo"
          onPress={takePhotoFromCamera}
          color="#fff"
          btnType="camera"
        />
        <ChoosePhotoButton
          buttonTitle="Choose Photo"
          color="#fff"
          btnType="image"
          onPress={choosePhotoFromLibrary}
        />
      </RBSheet>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: "Undo",
          color: "white",
          onPress: () => {
            // Do something
          },
        }}
        style={{ backgroundColor: "#ADD8E6" }}
      >
        <View>
          <Text>{snackBarMsg}</Text>
        </View>
      </Snackbar>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    width: "100%",
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#2e64e5",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#333333",
  },
});

const spinnerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    marginTop: 50,
  },
});

const updateUser = (user) => {
  firebaseApp
    .database()
    .ref("users")
    .child(firebaseApp.auth().currentUser.uid)
    .update(user);
};

//make this component available to the app
export default EditProfileScreen;
