//import liraries
import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import NotificationCard from "../components/NotificationCard";
import * as firebase from "firebase";

import Spinner from "react-native-loading-spinner-overlay";

import firebaseApp from "firebase/app";

// create a component
const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase
      .database()
      .ref("users")
      .child(firebaseApp.auth().currentUser.uid)
      .child("Notification")
      .orderByChild("time")
      .on("value", (snapshot) => {
        let notificationList = [];
        snapshot.forEach((snap) => {
          let NotificationItem = snap.val();
          NotificationItem.id = snap.key;
          notificationList.push(NotificationItem);
        });
        setNotifications(notificationList.reverse());
        setLoading(false);
      });
  }, []);

  const viewAll = () => {
    console.log("aa");
    setLoading(true);
    firebase
      .database()
      .ref("users")
      .child(firebaseApp.auth().currentUser.uid)
      .child("Notification")
      .once("value", (snapshot) => {
        snapshot.forEach((snap) => {
          firebase
            .database()
            .ref("users")
            .child(firebaseApp.auth().currentUser.uid)
            .child("Notification")
            .child(snap.key)
            .update({ readed: true });
        });
      });
  };

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
    <ScrollView
      contentContainerStyle={{ marginVertical: 10, alignItems: "center" }}
    >
      <TouchableOpacity onPress={viewAll}>
        <Text style={{ color: "blue", marginBottom: 10 }}>View All</Text>
      </TouchableOpacity>
      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          time={item.time}
          navigation={navigation}
          item={item}
        />
      ))}
    </ScrollView>
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
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default NotificationsScreen;
