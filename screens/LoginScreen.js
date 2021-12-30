import React, { useContext, useState, useEffect } from "react";
import Dialog from "react-native-dialog";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import SocialButton from "../components/SocialButton";

import { Snackbar } from "react-native-paper";

import { FontAwesome5 } from "@expo/vector-icons";

import * as firebase from "firebase";
import firebaseAuth from "firebase";

import Spinner from "react-native-loading-spinner-overlay";
import { windowHeight, windowWidth } from "../utils/Dimentions";

import * as GoogleSignIn from "expo-google-sign-in";

const LoginScreen = ({ navigation }) => {
  const [tokenLoading, setTokenLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [forgetMailTxt, setForgetMailTxt] = useState("");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setTokenLoading(false);
      navigation.replace("AppStack");
    } else {
      setTokenLoading(false);
    }
  });

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const login = (email, password) => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.replace("AppStack");
        setLoading(false);
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  };

  const androidClientId =
    "511105291379-ksmuclqpav252gk0a9egh4vc1t35rk3a.apps.googleusercontent.com";
  const iosClientId =
    "511105291379-67vrreu8ta795ddb22idmkdirtukfhb6.apps.googleusercontent.com";

  const initAsync = async () => {
    try {
      await GoogleSignIn.initAsync({
        clientId: Platform.OS === "android" ? androidClientId : iosClientId,
      });
    } catch (error) {}
  };

  useEffect(() => {
    initAsync();
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        const user = await GoogleSignIn.signInSilentlyAsync();
      } else {
        setSnackBarMsg("Google Sign In Cancelled !");
        setVisible(true);
      }
    } catch (err) {
      setSnackBarMsg(err.message);
      console.log(err.message);
      setVisible(true);
    }
  };

  const forgetPassword = async () => {
    setLoading(true);

    try {
      await firebaseAuth.auth().sendPasswordResetEmail(forgetMailTxt);
      setLoading(false);
      setForgetMailTxt("");
      setShowDialog(false);
      setSnackBarMsg("Success!");
      setVisible(true);
    } catch (err) {
      setLoading(false);
      setSnackBarMsg(err.message);
      setVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Spinner
        //visibility of Overlay Loading Spinner
        visible={tokenLoading || loading}
        //Text with the Spinner
        textContent={"Loading..."}
        //Text style of the Spinner Text
        textStyle={styles.spinnerTextStyle}
      />
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.text}>Flip Paper</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign In"
        onPress={() => login(email, password)}
      />

      <View style={styles.googleButtonView}>
        <FontAwesome5.Button
          style={styles.googleButton}
          name="google"
          onPress={googleSignIn}
        >
          <Text style={styles.googleText}>Log In With Google</Text>
        </FontAwesome5.Button>
      </View>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => {
          setShowDialog(true);
        }}
      >
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.navButtonText}>
          Don't have an acount? Create here
        </Text>
      </TouchableOpacity>

      <View>
        <Dialog.Container visible={showDialog}>
          <Dialog.Title>Forget Password ?</Dialog.Title>
          <Dialog.Input
            onChangeText={(value) => {
              setForgetMailTxt(value);
            }}
            placeholder="Your Email"
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              setShowDialog(false);
            }}
          />
          <Dialog.Button label="Send Reset Email" onPress={forgetPassword} />
        </Dialog.Container>
      </View>
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
    </ScrollView>
  );
};

export default LoginScreen;

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
  googleText: {
    color: "white",
  },

  googleButton: {
    height: "100%",
    width: "100%",
    backgroundColor: "#4285F4",
    color: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },

  googleButtonView: {
    marginTop: 20,
    backgroundColor: "#4285F4",
    color: "#4285F4",
    height: windowHeight / 12,
    width: windowWidth / 1.5,
  },

  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 200,
    width: 200,
    marginBottom: 20,
    resizeMode: "cover",
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
  },
});
