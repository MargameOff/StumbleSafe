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
import GroupHeader from "../../components/Headers/GroupHeader";

export function MembersScreen() {
  const { name, id } = useLocalSearchParams();

  return (
      <View style={{flex: 1}}>
        <LinearGradient colors={["#46294F", "#120721"]} style={{flex: 1}}>
          <View style={styles.container}>
            <GroupHeader groupName={name} />
            <View style={{ flex: 1 }}>
              <MemberList size={1} groupId={id} />
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
});
