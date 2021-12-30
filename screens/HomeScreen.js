//import liraries
import React, { Component, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import FormButton from "../components/FormButton";

import Ionicons from "react-native-vector-icons/Ionicons";
import { Container } from "../styles/FeedStyles";
import PostCard from "../components/PostCard";
import firebase from "firebase";
import userContext from "../utils/UserContext";

import firebaseApp from "firebase/app";
import "firebase/auth";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

const DUMMY_POSTS = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../assets/users/user-3.jpg'),
    postTime: '4 mins ago',
    post:
      'Hey there, this is my test for a post of Flip Paper.',
    postImg: require('../assets/posts/post-img-3.jpg'),
    liked: true,
    likes: '14',
    comments: '5',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-1.jpg'),
    postTime: '2 hours ago',
    post:
      'Hey there, this is my test for a post of Flip Paper.',
    postImg: 'none',
    liked: false,
    likes: '8',
    comments: '0',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    postTime: '1 hours ago',
    post:
      'Hey there, this is my test for a post of Flip Paper.',
    postImg: require('../assets/posts/post-img-2.jpg'),
    liked: true,
    likes: '1',
    comments: '0',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    postTime: '1 day ago',
    post:
      'Hey there, this is my test for a post of Flip Paper.',
    postImg: require('../assets/posts/post-img-4.jpg'),
    liked: true,
    likes: '22',
    comments: '4',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    postTime: '2 days ago',
    post:
      'Hey there, this is my test for a post of Flip Paper.',
    postImg: 'none',
    liked: false,
    likes: '0',
    comments: '0',
  },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// create a component
const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token)
      firebaseApp
        .database()
        .ref("users")
        .child(firebaseApp.auth().currentUser.uid)
        .child("TokenNotification")
        .set(expoPushToken);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [expoPushToken]);

  useEffect(() => {
    firebaseApp
      .database()
      .ref("users")
      .child(firebaseApp.auth().currentUser.uid)
      .once("value")
      .then((snapshot) => {
        setCurrentUser(snapshot.val());
      });

    firebase
      .database()
      .ref("posts")
      .orderByChild('postTime')
      .on("value", (snapshot) => {
        let postList = [];
        snapshot.forEach((snap) => {
          let postItem = snap.val();
          postItem.id = snap.key;
          postList.push(postItem);
        });
        setPosts(postList.reverse());
      });
  }, []);

  return (
    <Container>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard
            navigation={navigation}
            fromPost={true}
            currentUser={currentUser}
            item={item}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
};

//make this component available to the app
export default HomeScreen;

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    console.log("bb")
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#fff",
      getExpoPushTokenAsync: '@ventus69/FlipPaper'
    });
  }

  return token;
}
