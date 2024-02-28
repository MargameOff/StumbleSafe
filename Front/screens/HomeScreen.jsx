import { Link } from "expo-router";
import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { Image } from "expo-image";
import { Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import GreenButton from "../components/GreenButton";
import TransparentButton from "../components/TransparentButton";
export function HomeScreen() {
    let [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_600SemiBold });
    if (!fontsLoaded) {
      return <View></View>;
    } else {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={["#46294F", "#120721"]}
            style={styles.container}
          >
            <Image
              contentFit="contain"
              source={require("../assets/login-illustration.png")}
              style={styles.image}
            />
            <Text style={styles.title}>StumbleSafe</Text>
            <View style={{ height: 40 }} />
            <GreenButton label={"Créer un compte"} link={"/register"} />
            <View style={{ height: 20 }} />
            <TransparentButton label={"Se connecter"} link={"/login"} />
          </LinearGradient>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    title: {
      fontFamily: "Montserrat_700Bold",
      fontSize: 35,
      color: "white",
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
    },
    image: {
      width: vw(100),
      height: vh(55),
      marginTop: -30,
      marginBottom: -50,
    },
    buttonText: {
      color: "white",
      fontFamily: "Montserrat_600SemiBold",
      fontSize: 16,
    },
    loginButton: {
      width: 200,
      borderColor: "transparent",
    },
    loginTitle: {
      color: "#ababab",
    },
  });
  