import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import SocialButton from "../components/SocialButton";

import Spinner from "react-native-loading-spinner-overlay";
import { Snackbar } from "react-native-paper";

import * as firebase from "firebase";
import firebaseDB from "firebase";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");

  const register = (email, password) => {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setLoading(false);
        const user = userCredential.user;
        firebaseDB.database().ref().child("users").child(user.uid).set({
          name: name,
          image:
            "https://firebasestorage.googleapis.com/v0/b/social-network-react-nat-a4593.appspot.com/o/no-user-image-icon-26.png?alt=media&token=80a0d998-3814-4f02-9085-dc331e987019",
          email: email,
        });
        navigation.replace("AppStack");
      })
      .catch((error) => {
        setLoading(false);
        setSnackBarMsg(error.message);
        setVisible(true);
      });
  };

  return (
    <View style={styles.container}>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={loading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      <Text style={styles.text}>Create an account</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={name}
        onChangeText={(userName) => setName(userName)}
        placeholderText="Name"
        iconType="user"
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign Up"
        onPress={() => register(email, password)}
      />

      <View style={styles.textPrivate}>
        <Text style={styles.color_textPrivate}>
          By registering, you confirm that you accept our{" "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSnackBarMsg("Term of Service Clicked!");
            setVisible(true);
          }}
        >
          <Text style={[styles.color_textPrivate, { color: "#e88832" }]}>
            Terms of service
          </Text>
        </TouchableOpacity>
        <Text style={styles.color_textPrivate}> and </Text>
        <Text style={[styles.color_textPrivate, { color: "#e88832" }]}>
          Privacy Policy
        </Text>
      </View>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: "Undo",
          color: "white",
          onPress: () => {
            // Do something
          },
        }}
        style={{ backgroundColor: "#ADD8E6" }}
      >
        <View>
          <Text>{snackBarMsg}</Text>
        </View>
      </Snackbar>
    </View>
  );
};

export default SignupScreen;

const spinnerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    marginTop: 10,
  },
});

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    backgroundColor: "#f9fafd",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
  },
  textPrivate: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 35,
    justifyContent: "center",
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: "400",
    color: "grey",
  },
});
