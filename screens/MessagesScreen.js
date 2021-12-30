//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

// create a component
const MessagesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>Comming Soon</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

//make this component available to the app
export default MessagesScreen;
