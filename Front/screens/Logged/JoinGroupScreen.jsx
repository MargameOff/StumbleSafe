import React, { useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { vw, vh } from "react-native-expo-viewport-units";
import GreenButton from "../../components/Buttons/GreenButton";
import CheckBoxStumble from "../../components/CheckBoxStumble";
import { router } from "expo-router";
import { getJwtToken } from "../../Utils";
import ReturnButton from "../../components/Buttons/ReturnButton";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
export function JoinGroupScreen() {

  const [code, setCode] = useState('');
  const [isAgree, setAgree] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function createGroupClk(event) {
    
    if(!isAgree) {
        setErrorMsg("Merci d'accepter le partage de votre position en cochant la case");
        return;
    }

    getJwtToken((token) => { 
      if(token != null) { // if token is null (never happen theoretically)
        fetch("http://localhost:8080/api/groups/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({
            "groupInfos": {
                "code": code,
            }
        }),
        }).then(async (res) => {
          const data = await res.json();
          if(res.status == 200) return data;
          return Promise.reject(data);
        })
        .then((data) => {
          router.replace('/dashboard');
        }).catch((err) => {
          setErrorMsg(err.message)
        });
      } else {
        router.replace('/login');
      }
    
    })
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>
          <Image
            contentFit="contain"
            source={require("../../assets/logo/logo.png")}
            style={styles.image}
          />

          <ReturnButton />

          <Text style={styles.title}>Rejoindre un Groupe</Text>
          <View style={{ height: 15 }} />
          <Text style={{...styles.buttonText, ...styles.errorText}}>{errorMsg}</Text>
          <View style={{ height: 15 }} />

          <SmoothPinCodeInput
          codeLength={6}
          value={code}
          restrictToNumbers={true}
          cellStyleFocused={{
            borderColor: '#50E3A5',
          }}
          onTextChange={code => setCode(code)}
          />

          <View style={{ height: 30 }} />
          <CheckBoxStumble text="J'accepte de partager ma position avec les membres de ce groupe" isChecked={isAgree} onChecked={setAgree}></CheckBoxStumble>
          <View style={{ height: 30 }} />
          <GreenButton label={"Rejoindre"} link={"/group/join"} onPress={createGroupClk} />
          <View style={{ height: 10 }} />
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
  buttonText: {
    color: "white",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },
  errorText: {
    color: "#E35050",
    fontSize: 10,
    textAlign: 'center'
  }
});
