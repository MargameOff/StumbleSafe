import React, { useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { vw, vh } from "react-native-expo-viewport-units";
import GreenButton from "../../components/Buttons/GreenButton";
import { router } from "expo-router";
import { getJwtToken } from "../../Utils";
import ReturnButton from "../../components/Buttons/ReturnButton";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export function CreateTripScreen() {

  // Default region when opening the screen
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [errorMsg, setErrorMsg] = useState('');

  async function createGroupClk(event) {

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

  const onMapDrag = (region) => {
    console.log(region)
    setRegion(region);
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>

          <ReturnButton />
          <Text style={styles.title}>Nouveau Trajet</Text>
          
          <View style={{ height: 15 }} />
          <Text style={{...styles.buttonText, ...styles.errorText}}>{errorMsg}</Text>
          <View style={{ height: 15 }} />

          <MapView
            region={region}
            onRegionChange={this.onMapDrag}
            style={styles.map}
            zoomControlEnabled={true}
            zoomEnabled={true}
          />

          <View style={{ height: 30 }} />
          <GreenButton label={"Créer"} link={"/group/join"} onPress={createGroupClk} />
          <View style={{ height: 10 }} />
        </LinearGradient>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 26,
    color: "white",
    marginTop: 20,
  },
  container: {
    width: "100%",
    height: "100%"
  },
  gradient: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
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
  },
  map: {
    minWidth: 300,
    minHeight: 400,
    width: "90%",
    height: "50%"
  }
});
