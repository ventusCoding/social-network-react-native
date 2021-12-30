//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import moment from "moment";

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

// create a component
const CommentCard = ({item}) => {

    return (
        <Card key={item.id}>
        <UserInfo>
          <UserImg source={{ uri: item.userImg }} />
          <UserInfoText>
            <UserName>{item.userName}</UserName>
            <PostTime>{moment(item.postTime).fromNow()}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.comment}</PostText>
      </Card>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default CommentCard;
