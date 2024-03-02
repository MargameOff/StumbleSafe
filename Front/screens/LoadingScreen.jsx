import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { getJwtToken } from "../Utils";
import { router } from 'expo-router';
export function LoadingScreen() {
    let [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_600SemiBold });

    getJwtToken((token) => {
      console.log("LoadingS => "+token)
      if(token == null) {
        router.replace('/home');
      } else {
        router.replace('/dashboard');
      }
    })

    if (!fontsLoaded) {
      return <View></View>;
    } else {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={["#46294F", "#120721"]}
            style={styles.container}
          >
            
            <Text style={styles.loadingText}>Loading...</Text>
          
          </LinearGradient>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    loadingText: {
      fontFamily: "Montserrat_700Bold",
      fontSize: 35,
      color: "white",
      flexDirection: "column",
      alignContent: "center",
    }
  });
  