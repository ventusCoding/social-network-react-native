import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { windowHeight, windowWidth } from "../utils/Dimentions";

const ChoosePhotoButton = ({ buttonTitle, btnType, color , ...rest}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <FontAwesome name={"camera"} size={22} name={btnType} color={color}/>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default ChoosePhotoButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: "80%",
    height: windowHeight / 15,
    backgroundColor: "#2e64e5",
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
