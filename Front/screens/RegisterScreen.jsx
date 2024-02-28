import React from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { vw, vh } from "react-native-expo-viewport-units";
import GreenButton from "../components/GreenButton";
import TransparentButton from "../components/TransparentButton";
import IconInput from "../components/IconInput";

export function RegisterScreen() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>
          <Image
            contentFit="contain"
            source={require("../assets/login-illustration.png")}
            style={styles.image}
          />

          <Text style={styles.title}>Créer un Compte</Text>
          <View style={{ height: 30 }} />
          <IconInput varName={"identifiant"} label={"Identifiant d'utilisateur"} isPassword={false}/>
          <View style={{ height: 15 }} />
          <IconInput varName={"email"} label={"Adresse mail"} isPassword={false}/>
          <View style={{ height: 15 }} />
          <IconInput varName={"nomUtilisateur"} label={"Nom d'utilisateur"} isPassword={false}/>
          <View style={{ height: 15 }} />
          <IconInput varName={"motDePasse"} label={"Mot de passe"} isPassword={true}/>
          <View style={{ height: 15 }} />
          <IconInput varName={"confirmMotDePasse"} label={"Confirmer le mot de passe"} isPassword={true}/>
          <View style={{ height: 30 }} />
          <GreenButton label={"Créer le compte"} link={"/home"} />
          <View style={{ height: 10 }} />
          <TransparentButton label={"Se connecter"} link={"/login"} />
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 35,
    color: "white",
    marginTop: 20,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: vw(100),
    height: vh(35),
    marginTop: -50,
    marginBottom: -50,
  },
});
