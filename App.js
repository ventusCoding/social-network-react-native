import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";

import firebase from "firebase";

import AsyncStorage from "@react-native-async-storage/async-storage";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import AppStackScreen from "./screens/AppStack";
import userContext from "./utils/UserContext";
import ProfileScreen from "./screens/ProfileScreen";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChB1wmNlFgrcEWNUuh6_YoXEqRvq2v6ls",
  authDomain: "social-network-react-nat-a4593.firebaseapp.com",
  databaseURL:
    "https://social-network-react-nat-a4593-default-rtdb.firebaseio.com",
  projectId: "social-network-react-nat-a4593",
  storageBucket: "social-network-react-nat-a4593.appspot.com",
  messagingSenderId: "511105291379",
  appId: "1:511105291379:web:a5d7a50266751f2f49c606",
  measurementId: "G-FE58RWS007",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const AppStack = createStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    return (
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <AppStack.Screen name="Onboarding" component={OnboardingScreen} />
          <AppStack.Screen name="Login" component={LoginScreen} />
          <AppStack.Screen name="Signup" component={SignupScreen} />
          <AppStack.Screen name="AppStack" component={AppStackScreen} />
          <AppStack.Screen
            options={{ headerShown: true, title: "" }}
            name="UserProfile"
            component={ProfileScreen}
          />
        </AppStack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <AppStack.Screen name="Login" component={LoginScreen} />
          <AppStack.Screen name="Signup" component={SignupScreen} />
          <AppStack.Screen name="AppStack" component={AppStackScreen} />
          <AppStack.Screen
            options={{ headerShown: true, title: "" }}
            name="UserProfile"
            component={ProfileScreen}
          />
        </AppStack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
