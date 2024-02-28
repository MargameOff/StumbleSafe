import { Link } from "expo-router";
import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { Image } from "expo-image";
import { Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { vw, vh } from "react-native-expo-viewport-units";
import { Input } from "@rneui/themed";
import GreenButton from "../components/GreenButton";
import TransparentButton from "../components/TransparentButton";
import IconInput from "../components/IconInput";
export function LoginScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#46294F", "#120721"]} style={styles.container}>
        <Image
          contentFit="contain"
          source={require("../assets/logo/logo.png")}
          style={styles.image}
        />
        <View style={{ height: 30 }} />
        <Text style={styles.title}>Se Connecter</Text>
        <View style={{ height: 30 }} />
        <IconInput varName={"nomUtilisateur"} label={"Nom d'utilisatreur"} isPassword={false}/>
        <View style={{ height: 20 }} />
        <IconInput varName={"motDePasse"} label={"Mot de passe"} isPassword={true}/>
        <View style={{ height: 30 }} />
        <GreenButton label={"Connexion"} link={"/login"} />
        <View style={{ height: 20 }} />
        <TransparentButton label={"Mot de passe oublié"} link={"/forgetPass"} />
      </LinearGradient>
    </View>
  );
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
    height: vh(40),
    marginTop: 0,
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
