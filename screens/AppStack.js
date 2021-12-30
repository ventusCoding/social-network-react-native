import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import HomeScreen from "./HomeScreen";
import ChatScreen from "./ChatScreen";
import ProfileScreen from "./ProfileScreen";
import AddPostScreen from "./AddPostScreen";
import MessagesScreen from "./MessagesScreen";
import EditProfileScreen from "./EditProfileScreen";

import * as firebase from "firebase";
import firebaseApp from "firebase/app";
import firebaseDB from "firebase/app";
import "firebase/auth";
import userContext from "../utils/UserContext";
import NotificationsScreen from "./NotificationsScreen";
import SeePostScreen from "./SeePostScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({ navigation }) => {
  const [notificationLength, setNotificationLength] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase
      .database()
      .ref("users")
      .child(firebaseApp.auth().currentUser.uid)
      .child("Notification")
      .on("value", (snapshot) => {
        if (snapshot) {
          let notificationList = [];
          snapshot.forEach((snap) => {
            if (snap.val().readed === false) {
              let NotificationItem = snap.val();
              notificationList.push(NotificationItem);
            }
          });

          setNotificationLength(notificationList.length)
          setLoading(false);
        }
        
      });
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Flip Paper"
        component={HomeScreen}
        options={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#2e64e5",
            fontSize: 18,
          },
          headerStyle: {
            shadowColor: "#fff",
            elevation: 0,
          },
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <FontAwesome5.Button
                name="plus"
                size={22}
                backgroundColor="#fff"
                color="#2e64e5"
                onPress={() => navigation.navigate("AddPost")}
              />
            </View>
          ),
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              {loading ? null : (
                <FontAwesome5.Button
                  name="bell"
                  size={22}
                  backgroundColor="#fff"
                  color={notificationLength <= 0 ? "#2e64e5" : "#FF0000"}
                  onPress={() => navigation.navigate("Notification")}
                >
                  {notificationLength > 0
                    ? `${notificationLength} ${
                        notificationLength > 1
                          ? "Notifications"
                          : "Notification"
                      }\nNot Read`
                    : null}
                </FontAwesome5.Button>
              )}
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          title: "",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#2e64e515",
            shadowColor: "#2e64e515",
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={25} color="#2e64e5" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationsScreen}
        options={{
          title: "",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#2e64e515",
            shadowColor: "#2e64e515",
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={25} color="#2e64e5" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="SeePost"
        component={SeePostScreen}
        options={{
          title: "",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#2e64e515",
            shadowColor: "#2e64e515",
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={25} color="#2e64e5" />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="HomeProfile"
        component={ProfileScreen}
        options={{
          title: "",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#fff",
            shadowColor: "#fff",
            elevation: 0,
          },
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <View style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={25} color="#2e64e5" />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const MessageStack = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({
        title: route.params.userName,
        headerBackTitleVisible: false,
      })}
    />
  </Stack.Navigator>
);

const ProfileStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerTitle: "Edit Profile",
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#fff",
          shadowColor: "#fff",
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const AppStack = ({ navigation }) => {
  const userFirebase = firebaseApp.auth().currentUser;
  let user;

  useEffect(() => {
    firebaseApp
      .database()
      .ref("users")
      .child(userFirebase.uid)
      .once("value")
      .then((snapshot) => {
        user = snapshot.val();
        user.id = userFirebase.uid;
      })
      .catch((error) => console.log(error.message));
  }, []);

  const getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : "";

    if (routeName === "Chat") {
      return false;
    }
    return true;
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBarOptions={{
        activeTintColor: "#2e64e5",
      }}
    >
      <Tab.Screen
        name="Home"
        component={FeedStack}
        options={({ route }) => ({
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
