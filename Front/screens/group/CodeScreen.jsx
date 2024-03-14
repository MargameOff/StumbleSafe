import React, {useEffect, useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView, TouchableOpacity,
} from "react-native";
import TitleText from "../../components/TitleText";
import GroupItem from "../../components/Items/GroupItem";
import {getJwtToken} from "../../Utils";
import {router, Slot, useLocalSearchParams} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import TripItem from "../../components/Items/TripItem";
import ImageButton from "../../components/Buttons/ImageButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import BottomBar from "../../navigation/BottomBar";
import ReturnButton from "../../components/Buttons/ReturnButton";
import TripList from "../../components/List/TripList";
import AlertList from "../../components/List/AlertList";
import GroupBottomBar from "../../navigation/GroupBottomBar";
import MemberList from "../../components/List/MemberList";
import {Image} from "expo-image";
import GroupHeader from "../../components/Headers/GroupHeader";
import {vh, vw} from "react-native-expo-viewport-units";

export function CodeScreen() {
  const { name, code } = useLocalSearchParams();

  return (
      <View style={{flex: 1}}>
        <LinearGradient colors={["#46294F", "#120721"]} style={{flex: 1}}>
          <View style={styles.container}>
            <GroupHeader groupName={name} />

            <View style={{ flex: 1 }}>
              <Image
                  contentFit="contain"
                  source={require("../../assets/logo/logo.png")}
                  style={styles.image}
              />
              <View style={{ flex: 1 }}>
                <View style={{ alignItems: "center" }}>
                  <Text
                      style={{
                        fontSize: 30,
                        color: "white",
                        fontFamily: "Montserrat_Bold",
                        textAlign: "center"
                      }}
                  >
                    {"Code d'invitation"}
                  </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.title}>{code}</Text>
                </View>
                <View style={{ marginTop: 25}}>
                  <Text style={styles.description}>{"Vous pouvez donner ce code à un autre utilisateur afin qu'il puisse rejoindre le groupe."}</Text>
                </View>
              </View>
            </View>

          </View>
        </LinearGradient>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    flexDirection: "column",
  },
  title: {
    fontSize: 40,
    fontFamily: "Montserrat_Medium",
    color: "white",
    letterSpacing: 20
  },
  description: {
    fontSize: 20,
    fontFamily: "Montserrat_Medium",
    color: "white",
    textAlign: "center"
  },
  item: {
    height: 100,
    borderRadius: 25,
    marginTop: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  },
  image: {
    width: vw(100),
    height: vh(35),
    marginHorizontal: -20
  },
});
