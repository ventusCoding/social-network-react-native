//import liraries
import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import PostCard from "../components/PostCard";
import * as firebase from "firebase";

import Spinner from "react-native-loading-spinner-overlay";

import firebaseApp from "firebase/app";

// create a component
const SeePostScreen = ({ route }) => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);

  const { postId, notificationId } = route.params;

  useEffect(() => {
    firebase
      .database()
      .ref("posts")
      .child(postId)
      .on("value", (snapshot) => {
        let postItem = snapshot.val();
        postItem.id = snapshot.key;
        setPost(postItem);
        setLoading(false);
      });

    firebase
      .database()
      .ref("users")
      .child(firebaseApp.auth().currentUser.uid)
      .child("Notification")
      .child(notificationId)
      .child("readed")
      .set(true);
  }, []);

  return loading ? (
    <Spinner
      //visibility of Overlay Loading Spinner
      visible={loading}
      //Text with the Spinner
      textContent={"Loading..."}
      //Text style of the Spinner Text
      textStyle={styles.spinnerTextStyle}
    />
  ) : (
    <View style={styles.container}>
      <View style={styles.Post}>
        <PostCard key={postId} item={post} />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  Post: {
    marginTop: 30,
  },
  container: {
    flex: 1,
    alignItems: "center",

    backgroundColor: "#fff",
  },
});

//make this component available to the app
export default SeePostScreen;
