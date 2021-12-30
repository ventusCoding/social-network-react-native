import React, { useContext, useEffect, useState, useRef } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

import Dialog from "react-native-dialog";
import { windowHeight, windowWidth } from "../utils/Dimentions";

import CommentButton from "./CommentButton";

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from "../styles/FeedStyles";

import uuid from "uuid";

import moment from "moment";

import firebaseApp from "firebase/app";
import firebaseDB from "firebase";
import "firebase/auth";

import { View, FlatList, Alert, TouchableOpacity } from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import CommentCard from "./CommentCard";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

const PostCard = ({ item, currentUser, navigation, fromPost }) => {
  const refRBSheet = useRef();

  const [like, setLike] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [commentInput, setCommentInput] = useState();

  const myPost = firebaseApp.auth().currentUser.uid === item.userId;

  useEffect(() => {
    firebaseApp
      .database()
      .ref("posts")
      .child(item.id)
      .child("likesList")
      .child(firebaseApp.auth().currentUser.uid)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          setLike(true);
        } else {
          setLike(false);
        }
      });
  }, []);

  const likeIcon = like ? "heart" : "heart-outline";
  const likeIconColor = like ? "#2e64e5" : "#333";

  const commentPost = async () => {
    if (!commentInput) {
      return;
    }

    firebaseDB
      .database()
      .ref()
      .child("posts")
      .child(item.id)
      .child("comments")
      .set(firebaseDB.database.ServerValue.increment(1));

    firebaseDB
      .database()
      .ref()
      .child("posts")
      .child(item.id)
      .child("commentsList")
      .child(uuid.v4())
      .set({
        comment: commentInput,
        postTime: firebaseDB.database.ServerValue.TIMESTAMP,
        userId: firebaseApp.auth().currentUser.uid,
        userImg: currentUser.image,
        userName: currentUser.name,
      })
      .then(async () => {
        if (item.userId !== firebaseApp.auth().currentUser.uid) {
          await sendPushNotification(
            item.TokenNotification,
            "You Got New Comment !",
            `${currentUser.name} comment your post !`
          );

          firebaseDB
          .database()
          .ref()
          .child("users")
          .child(item.userId)
          .child("Notification")
          .child(uuid.v4())
          .set({
            postId: item.id,
            userId: item.userId,
            userImg: currentUser.image,
            userName: currentUser.name,
            readed:false,
            time: firebaseDB.database.ServerValue.TIMESTAMP,
            title: "You Got New Comment !",
            description: `${currentUser.name} comment your post !`,
          });

        }

        setShowDialog(false);
      });
  };

  const removePost = () => {
    Alert.alert("Remove", "Do you want to remove this post ?", [
      {
        text: "No",
        onPress: () => {},
      },
      {
        text: "Yes",
        onPress: async () => {
          firebaseDB.database().ref().child("posts").child(item.id).remove();
          firebaseDB
            .database()
            .ref()
            .child("users")
            .child(firebaseApp.auth().currentUser.uid)
            .child("posts")
            .child(item.id)
            .remove();
        },
      },
    ]);
  };

  const sharePost = async () => {
    Alert.alert("Share", "Do you want to share this post ?", [
      {
        text: "No",
        onPress: () => {},
      },
      {
        text: "Yes",
        onPress: async () => {
          const newItem = {
            ...item,
            userImg: currentUser.image,
            userName: currentUser.name,
            likes: 0,
            comments: 0,
            likesList: {},
            commentsList: {},
            userId: firebaseApp.auth().currentUser.uid,
          };

          firebaseDB
            .database()
            .ref()
            .child("posts")
            .child(uuid.v4())
            .set(newItem);

          if (item.userId !== firebaseApp.auth().currentUser.uid) {
            await sendPushNotification(
              item.TokenNotification,
              "You Got New Share !",
              `${currentUser.name} share your post !`
            );

            firebaseDB
            .database()
            .ref()
            .child("users")
            .child(item.userId)
            .child("Notification")
            .child(uuid.v4())
            .set({
              postId: item.id,
              userId: item.userId,
              time: firebaseDB.database.ServerValue.TIMESTAMP,
              userImg: currentUser.image,
              readed:false,
              userName: currentUser.name,
              title: "You Got New Share !",
              description: `${currentUser.name} share your post !`,
            });
  
          }
        },
      },
    ]);
  };

  const likePost = async () => {
    const id = item.userId;

    if (!like) {
      firebaseDB
        .database()
        .ref()
        .child("posts")
        .child(item.id)
        .child("likesList")
        .child(firebaseApp.auth().currentUser.uid)
        .set(firebaseApp.auth().currentUser.uid);

      if (item.userId !== firebaseApp.auth().currentUser.uid) {
        
        firebaseApp
        .database()
        .ref("users")
        .child(item.userId)
        .child("TokenNotification")
        .once("value", async(snapshot) => {
          if (snapshot.exists()) {
            
            await sendPushNotification(
              snapshot.val(),
              "You Got New Like !",
              `${currentUser.name} like your post !`
            );    

          }
        });


        firebaseDB
          .database()
          .ref()
          .child("users")
          .child(item.userId)
          .child("Notification")
          .child(uuid.v4())
          .set({
            postId: item.id,
            userId: item.userId,
            time: firebaseDB.database.ServerValue.TIMESTAMP,
            title: "You Got New Like !",
            userImg: currentUser.image,
            readed:false,
            userName: currentUser.name,
            description: `${currentUser.name} like your post !`,
          });

      }
    } else {
      firebaseDB
        .database()
        .ref()
        .child("posts")
        .child(item.id)
        .child("likesList")
        .child(firebaseApp.auth().currentUser.uid)
        .remove();
    }

    firebaseDB
      .database()
      .ref()
      .child("posts")
      .child(item.id)
      .child("likes")
      .set(
        !like
          ? firebaseDB.database.ServerValue.increment(1)
          : firebaseDB.database.ServerValue.increment(-1)
      );

    setLike(!like);
  };

  return (
    <React.Fragment>
      <Card key={item.id}>
        <TouchableOpacity
          onPress={() => {
            if (fromPost) {
              navigation.navigate(
                item.userId !== firebaseApp.auth().currentUser.uid
                  ? "UserProfile"
                  : "Profile",
                { passedUserId: item.userId }
              );
            }
          }}
        >
          <UserInfo>
            <UserImg source={{ uri: item.userImg }} />
            <UserInfoText>
              <UserName>{item.userName}</UserName>
              <PostTime>{moment(item.postTime).fromNow()}</PostTime>
            </UserInfoText>
          </UserInfo>
        </TouchableOpacity>
        {item.post ? <PostText>{item.post}</PostText> : null}
        {item.postImg ? <PostImg source={{ uri: item.postImg }} /> : null}
        <InteractionWrapper>
          <Interaction onPress={() => likePost()}>
            <Ionicons name={likeIcon} color={likeIconColor} size={25} />
            <InteractionText active={like ? true : false}>
              {item.likes ? item.likes : null}{" "}
              {item.likes > 1 ? "Likes" : "Like"}
            </InteractionText>
          </Interaction>
          <Interaction onPress={() => refRBSheet.current.open()}>
            <Ionicons name="md-chatbubble-outline" size={25} />
            <InteractionText>
              {item.comments ? item.comments : null}{" "}
              {item.comments > 1 ? "Comments" : "Comment"}
            </InteractionText>
          </Interaction>
          <Interaction
            onPress={() => {
              !myPost ? sharePost() : removePost();
            }}
          >
            <Ionicons
              name={!myPost ? "paper-plane-outline" : "md-trash-bin"}
              size={25}
            />
            <InteractionText>{!myPost ? "Share" : "Remove"}</InteractionText>
          </Interaction>
        </InteractionWrapper>
      </Card>
      <View>
        <Dialog.Container visible={showDialog}>
          <Dialog.Title>Comment This Post</Dialog.Title>
          <Dialog.Input
            onChangeText={(value) => {
              setCommentInput(value);
            }}
            placeholder="Your Comment"
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              setShowDialog(false);
            }}
          />
          <Dialog.Button label="Add Comment" onPress={commentPost} />
        </Dialog.Container>
      </View>

      <RBSheet
        ref={refRBSheet}
        dragFromTopOnly={true}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={windowHeight - 100}
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
        <CommentButton
          buttonTitle="Add Comment"
          onPress={() => setShowDialog(true)}
        />
        {item.commentsList ? (
          <Container>
            <FlatList
              data={Object.values(item.commentsList)}
              renderItem={({ item }) => (
                <CommentCard currentUser={currentUser} item={item} />
              )}
              keyExtractor={(item) => item.id}
            />
          </Container>
        ) : null}
      </RBSheet>
    </React.Fragment>
  );
};

async function sendPushNotification(expoPushToken, title, description) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: description,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default PostCard;
