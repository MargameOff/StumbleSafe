import { Link, router } from "expo-router";
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
import GreenButton from "../components/Buttons/GreenButton";
import TransparentButton from "../components/Buttons/TransparentButton";
import * as FileSystem from 'expo-file-system';
import { JWT_CACHE_FILE } from "../Utils";

export function DashboardScreen() {
    let [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_600SemiBold });
    
    function disconnectClk() {
        FileSystem.deleteAsync(JWT_CACHE_FILE)
    }
    
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
            <Text style={styles.title}>Dashboard</Text>
            <View style={{ height: 40 }} />

            <TransparentButton label={"Se deconnecter"} link={"/home"} onPress={disconnectClk}/>
            <TransparentButton label={"Creer groupe"} link={"/group/creating"}/>

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
  