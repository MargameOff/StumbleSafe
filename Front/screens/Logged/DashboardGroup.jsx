import React, {useEffect, useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import TitleText from "../../components/TitleText";
import GroupItem from "../../components/Items/GroupItem";
import {getJwtToken} from "../../Utils";
import {router} from "expo-router";
import GroupList from "../../components/List/GroupList";

export function DashboardGroup() {
  return (
    <GroupList size={1} />
  );
}
