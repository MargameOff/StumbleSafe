import React, { useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { vw, vh } from "react-native-expo-viewport-units";
import GreenButton from "../../components/GreenButton";
import TransparentButton from "../../components/TransparentButton";
import IconInput from "../../components/IconInput";
import CheckBoxStumble from "../../components/CheckBoxStumble";

export function GroupeCreatingScreen() {

  const [namegroup, setNameGroup] = useState("");
  const [isAgree, setAgree] = useState(false);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>
          <Image
            contentFit="contain"
            source={require("../../assets/logo/logo.png")}
            style={styles.image}
          />

          <Text style={styles.title}>Créer un Groupe</Text>
          <View style={{ height: 30 }} />
          <IconInput value={namegroup} onValueUpdated={(text) => setNameGroup(text)} label={"Nom du groupe"} isPassword={false}/>
          <View style={{ height: 30 }} />
          <CheckBoxStumble text="J'accepte de partager ma position avec les membres de ce groupe" isChecked={isAgree} onChecked={setAgree}></CheckBoxStumble>
          <View style={{ height: 30 }} />
          <GreenButton label={"Confirmer"} link={"/groupecreating"} />
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
});
