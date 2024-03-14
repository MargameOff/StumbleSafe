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
import GroupHeader from "../../components/Headers/GroupHeader";

export function DetailedGroupScreen() {
  const group = useLocalSearchParams();

  return (
      <View style={{flex: 1}}>
        <LinearGradient colors={["#46294F", "#120721"]} style={{flex: 1}}>
          <View style={styles.container}>
            <GroupHeader groupName={group.name} />
            <View style={{ flex: 1 }}>
              <AlertList size={0.4} isGroupRequired={false} />
              <TripList size={0.6} groupId={group.id} />
            </View>
          </View>
          <GroupBottomBar group={group} />
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
