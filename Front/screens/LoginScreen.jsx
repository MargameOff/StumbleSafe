import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { vw, vh } from "react-native-expo-viewport-units";
import GreenButton from "../components/Buttons/GreenButton";
import TransparentButton from "../components/Buttons/TransparentButton";
import IconInput from "../components/IconInput";
import { JWT_CACHE_FILE, getJwtToken } from "../Utils";
import * as FileSystem from 'expo-file-system';

import ReturnButton from "../components/Buttons/ReturnButton";
export function LoginScreen() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function loginClk(event) {

    fetch("http://localhost.24:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userInfos": {
            "nom": username,
            "password": password
        }
    }),
    }).then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      if(data.token == null) {
        setErrorMsg(data.message)
      } else {
        FileSystem.writeAsStringAsync(JWT_CACHE_FILE, data.token, {encoding: 'utf8'})
        router.replace('/dashboard');
      }
    }).catch((err) => {
      setErrorMsg(err.message)
    });
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#46294F", "#120721"]} style={styles.container}>
        <Image
          contentFit="contain"
          source={require("../assets/logo/logo.png")}
          style={styles.image}
        />
        <ReturnButton />
        <View style={{ height: 30 }} />
        <Text style={styles.title}>Se Connecter</Text>
        <View style={{ height: 15 }} />
        <Text style={{...styles.buttonText, ...styles.errorText}}>{errorMsg}</Text>
        <View style={{ height: 15 }} />
        <IconInput value={username} onValueUpdated={(text) => setUsername(text)} label={"Nom d'utilisateur"} isPassword={false}/>
        <View style={{ height: 20 }} />
        <IconInput value={password} onValueUpdated={(text) => setPassword(text)} label={"Mot de passe"} isPassword={true}/>
        <View style={{ height: 40 }} />
        <GreenButton label={"Connexion"} onPress={loginClk} link={"/login"} />
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
  errorText: {
    color: "#E35050",
    textAlign: "center"
  }
});
