import React from "react";
import {
  View,
} from "react-native";
import GroupList from "../../components/List/GroupList";
import TripList from "../../components/List/TripList";

export function Dashboard() {
  return (
    <View style={{ flex: 1 }}>
      <TripList size={0.4} />
      <GroupList size={0.6} />
    </View>
  );
}