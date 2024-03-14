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
import GreenButton from "../../components/Buttons/GreenButton";
import RedButton from "../../components/Buttons/RedButton";

export function LeaveGroupScreen() {
  const group = useLocalSearchParams();

  const leaveGroup = async () => {
    getJwtToken((token) => {
      if(token != null) {
        fetch("http://localhost:8080/api/groups/quit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
          body: JSON.stringify({
            groupInfos: {
              code: group.code
            }
          }),
        }).then(async (res) => {
          const data = await res.json();
          if(res.status == 200){
            console.log('Group leaved');
            router.replace('/dashboard');
            return data;
          }
          console.log('Group not leaved');
          return Promise.reject(data);
        }).catch(error => console.log(error));
      } else {
        router.replace('/login');
      }
    })
  };

  return (
      <View style={{flex: 1}}>
        <LinearGradient colors={["#46294F", "#120721"]} style={{flex: 1}}>
          <View style={styles.container}>
            <GroupHeader groupName={group.name} />

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
                    {"Quitter le groupe"}
                  </Text>
                </View>
                <View style={{ marginTop: 25}}>
                  <Text style={styles.description}>{"Êtes-vous sûr de vouloir quitter le groupe ? Ce choix est définitif."}</Text>
                </View>
                <View style={{ alignItems: "center", paddingTop: 30 }} >
                  <RedButton label={"Quitter le groupe"} onPress={leaveGroup} link={{ pathname: "/group/leave", param: group }}/>
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
  description: {
    fontSize: 20,
    fontFamily: "Montserrat_Medium",
    color: "white",
    textAlign: "center"
  },
  image: {
    width: vw(100),
    height: vh(35),
    marginHorizontal: -20
  },
});
