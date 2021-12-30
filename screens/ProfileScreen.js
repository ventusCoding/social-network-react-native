import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import FormButton from "../components/FormButton";

import Spinner from "react-native-loading-spinner-overlay";

import PostCard from "../components/PostCard";

import firebaseApp from "firebase/app";
import firebaseDB from "firebase";
import "firebase/auth";
import * as firebase from "firebase";

// create a component
const ProfileScreen = ({ navigation, route }) => {
  let passedUserId;
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  if (route.params) {
    passedUserId = route.params.passedUserId;
  } else {
    passedUserId = firebaseApp.auth().currentUser.uid;
  }

  useEffect(() => {
    firebase
      .database()
      .ref("posts")
      .orderByChild("postTime")
      .on("value", (snapshot) => {
        let postList = [];
        snapshot.forEach((snap) => {
          if (snap.val().userId === passedUserId) {
            let postItem = snap.val();
            postItem.id = snap.key;
            postList.push(postItem);
          }
        });
        setPosts(postList.reverse());

        firebase
          .database()
          .ref("users")
          .child(passedUserId)
          .on("value", (snapshot) => {
            setUser(snapshot.val());
            setLoading(false);
          });
      });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={styles.userImg}
          source={{
            uri: user.image,
          }}
        />
        <Text style={styles.userName}> {user.name} </Text>
        {user.description ? (
          <Text style={styles.aboutUser}>{user.description}</Text>
        ) : null}
        <View style={styles.userBtnWrapper}>
          {passedUserId !== firebaseApp.auth().currentUser.uid ? (
            <>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userBtn} onPress={() => {}}>
                <Text style={styles.userBtnTxt}>Follow</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              >
                <Text style={styles.userBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.userBtn}
                onPress={() => {
                  firebase
                    .auth()
                    .signOut()
                    .then(() => {
                      navigation.replace("Login");
                    })
                    .catch((error) => {
                      alert(error.message);
                    });
                }}
              >
                <Text style={styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{posts.length}</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>10,000</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>100</Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
          </View>
        </View>

        {posts.length > 0 ? (
          posts.map((item) => (
            <PostCard currentUser={currentUser} key={item.id} item={item} />
          ))
        ) : (
          <Text>No Posts</Text>
        )}
      </ScrollView>
    </SafeAreaView>
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
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
    marginTop: 40,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  userBtn: {
    borderColor: "#2e64e5",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: "#2e64e5",
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: "center",
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

//make this component available to the app
export default ProfileScreen;
