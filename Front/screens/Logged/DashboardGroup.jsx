import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import TitleText from "../../components/TitleText";
import GroupItem from "../../components/Items/GroupItem";
import AlertItem from "../../components/Items/AlertItem";

// TODO
// DONNEES DE TEST, A REMPLACER PAR LES DONNEES RECUPEREES DE L'API UNE FOIS CELLE-CI IMPLEMENTEE

const GROUPDATA = [
  {
    id: "1",
    name: "IFA",
    nbMembers: 10,
    members: [
      "@Thomas",
      "@Hugo",
      "@Margot",
      "@Marie",
      "@Papa",
      "@Maman",
      "@Tom",
      "@Jean-Marc Petit",
      "@MM",
      "@Jean-Marc Petit",
    ],
  },
  {
    id: "2",
    name: "Famille",
    members: ["@Marie", "@Papa", "@Maman", "@Tom"],
  },
  {
    id: "3",
    name: "Crystal Clear",
    members: ["@Jean-Marc Petit", "@MM"],
  },
  {
    id: "4",
    name: "Pokemon Go",
    members: ["@Thomas", "@Hugo", "@Margot", "@Marie", "@Papa", "@Maman"],
  },
  {
    id: "5",
    name: "Groupe de Test",
    members: ["@Thomas", "@Hugo", "@Margot", "@Marie", "@Papa", "@Maman"],
  },
  {
    id: "6",
    name: "Coucou",
    members: ["@Thomas", "@Hugo", "@Margot", "@Marie", "@Papa", "@Maman"],
  },
];

export function DashboardGroup() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const renderGroupItems = () => {
    return GROUPDATA.map((item) => {
      const backgroundColor =
        item.id === selectedGroupId
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(255, 255, 255, 0.1)";

      return (
        <GroupItem
          key={item.id}
          item={item}
          onPress={() => setSelectedGroupId(item.id)}
          style={{ backgroundColor }}
        />
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TitleText title={"Mes Groupes"} />
        <ScrollView style={{ flex: 1 }}>{renderGroupItems()}</ScrollView>
      </View>
    </View>
  );
}
