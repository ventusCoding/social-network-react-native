//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import moment from "moment";

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  NotificationNew,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  NotificationInfo,
  Divider,
} from "../styles/FeedStyles";

// create a component
const NotificationCard = ({ item, time, navigation }) => {
  console.log("aa", item.id);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("SeePost", {
          postId: item.postId,
          notificationId: item.id,
        });
      }}
    >
      <Card key={item.id}>
        <UserInfo>
          <UserImg source={{ uri: item.userImg }} />

          <UserInfoText>
            <NotificationInfo>
              <UserName>{item.userName}</UserName>
              {item.readed ? null :<NotificationNew>New</NotificationNew>}
            </NotificationInfo>
            <PostTime>{moment(time).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.description}</PostText>
      </Card>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default NotificationCard;
