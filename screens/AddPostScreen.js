//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
} from "../styles/AddPost";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import { Constants } from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import firebaseDB from "firebase";
import uuid from "uuid";
import firebaseApp from "firebase/app";
import "firebase/auth";

import Spinner from "react-native-loading-spinner-overlay";

import { Snackbar } from "react-native-paper";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

// create a component
const AddPostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [post, setPost] = useState(null);
  const [visible, setVisible] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
          compress: 0.4,
          format: SaveFormat.PNG,
        }
      );

      setImage(manipResult.uri);
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

  const addNewPost = async () => {
    if (!post && !image) {
      alert("write something to share it !");
      return;
    }

    setLoading(true);

    const userId = firebaseApp.auth().currentUser.uid;
    let user;
    const postId = uuid.v4();

    firebaseApp
      .database()
      .ref("users")
      .child(userId)
      .once("value")
      .then((snapshot) => {
        user = snapshot.val();
      })
      .then(async () => {


        if (!image) {
          firebaseDB.database().ref().child("posts").child(postId).set({
            postTime: firebaseDB.database.ServerValue.TIMESTAMP,
            post: post,
            userId,
            userImg: user.image,
            userName: user.name,
            likes: 0,
            comments: 0,
          });

          firebaseDB
            .database()
            .ref()
            .child("users")
            .child(userId)
            .child("posts")
            .child(postId)
            .set(postId);

          setLoading(false);

          setSnackBarMsg("Success!", "saved successfully");
          setVisible(true);

          setTimeout(function () {
            navigation.navigate("Flip Paper");
          }, 0);
        } else {
          //upload the image
          let blob;
          try {
            blob = await getPictureBlob(image);
            const ref = await firebase
              .storage()
              .ref()
              .child(`posts/${uuid.v4()}`);
            const snapshot = await ref.put(blob);
            const downloadUrlResult = await snapshot.ref.getDownloadURL();

            firebaseDB.database().ref().child("posts").child(postId).set({
              postTime: Date.now(),
              post: post,
              postImg: downloadUrlResult,
              userId,
              userImg: user.image,
              userName: user.name,
              likes: 0,
              comments: 0,
            });

            firebaseDB
              .database()
              .ref()
              .child("users")
              .child(userId)
              .child("posts")
              .child(postId)
              .set(postId);

            return downloadUrlResult;
          } catch (e) {
            setLoading(false);
            setSnackBarMsg(e.message);
            setVisible(true);
          } finally {
            blob.close();

            setSnackBarMsg("Success!", "saved successfully");

            setLoading(false);

            setVisible(true);

            setTimeout(function () {
              navigation.navigate("Flip Paper");
            }, 0);
          }
        }
      })
      .catch((error) => console.log(error.message));
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
      <InputWrapper>
        {image ? <AddImage source={{ uri: image }} /> : null}
        <InputField
          placeholder="Whats on your mind ?"
          multiline
          numberOfLines={4}
          onChangeText={(content) => setPost(content)}
        />

        <SubmitBtn onPress={addNewPost}>
          <SubmitBtnText>Post</SubmitBtnText>
        </SubmitBtn>
      </InputWrapper>
      <ActionButton buttonColor="#2e64e5">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Take Photo"
          onPress={takePhotoFromCamera}
        >
          <Icon name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Choose Photo"
          onPress={choosePhotoFromLibrary}
        >
          <Icon name="md-images-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
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
    justifyContent: "center",
  },
});

//make this component available to the app
export default AddPostScreen;

const spinnerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    marginTop: 10,
  },
});
