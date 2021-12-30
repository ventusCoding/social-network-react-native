import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import Onboarding from "react-native-onboarding-swiper";

const Dots = ({ selected }) => {
  let backgroundColor;

  backgroundColor = selected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)";
  let width = selected ? 12 : 6;

  return (
    <View
      style={{
        width: width,
        height: 6,
        borderRadius:5,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const Skip = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16 }}>Skip</Text>
  </TouchableOpacity>
);

const Next = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16 }}>Next</Text>
  </TouchableOpacity>
);

const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16 }}>Done</Text>
  </TouchableOpacity>
);

const OnboardingScreen = ({ navigation }) => {
  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace("Login")}
      onDone={() => navigation.replace("Login")}
      pages={[
        {
          backgroundColor: "#f2d1a5",
          image: <Image style={styles.onBoardingImage} source={require("../assets/onBoarding/on-boarding-1.png")} />,
          title: "Connect to the World",
          subtitle: "A New Way To Connect With The World",
        },
        {
          backgroundColor: "#9c4eda",
          image: <Image style={styles.onBoardingImage} source={require("../assets/onBoarding/on-boarding-2.png")} />,
          title: "Share Your Favorites",
          subtitle: "Share Your Thoughts With Similar Kind of People",
        },
        {
          backgroundColor: "#7e8dfc",
          image: <Image style={styles.onBoardingImage3} source={require("../assets/onBoarding/on-boarding-3.png")} />,
          title: "Become The Star",
          subtitle: "Let The Spot Light Capture You",
        },
      ]}
    />
  );
};

var styles = StyleSheet.create({
  onBoardingImage: {
    width: 300,
    height: 220,   
  },
  onBoardingImage3: {
    width: 250,
    height: 220,   
  }
})

export default OnboardingScreen;