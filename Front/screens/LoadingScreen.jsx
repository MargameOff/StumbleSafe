import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { router } from 'expo-router';
import { JWT_CACHE_FILE, getJwtToken } from "../Utils";
import * as FileSystem from 'expo-file-system';

export function LoadingScreen() {
    let [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_600SemiBold });

    getJwtToken((token) => {
      fetch("http://stumblesafe.mariusdeleuil.fr:8090/api/users/login/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      }).then(async (res) => {
        const data = await res.json();
        if(res.status == 200) return data;
        return Promise.reject(data);
      })
      .then((data) => {
        FileSystem.writeAsStringAsync(JWT_CACHE_FILE, data.token, {encoding: 'utf8'})
        router.replace('/dashboard');
      }).catch(() => {
        router.replace('/home');
      })
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
  