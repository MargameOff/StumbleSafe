import React, {useEffect, useState} from "react";
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
import Notification from "../../components/Notification";
import {getJwtToken} from "../../Utils";
import {router} from "expo-router";

// TODO
// DONNEES DE TEST, A REMPLACER PAR LES DONNEES RECUPEREES DE L'API UNE FOIS CELLE-CI IMPLEMENTEE

const ALERTDATA = [
  {
    id: "1",
    name: "IFA",
    duration: 60 * 2 * 1000,
    user: "@Thomas",
    startDate: new Date(),
  },
  {
    id: "2",
    name: "Famille",
    duration: 60 * 3 * 1000,
    user: "@Marie",
    startDate: new Date(),
  },
  {
    id: "3",
    name: "Crystal Clear",
    duration: 60 * 4 * 1000,
    user: "@Papa",
    startDate: new Date(),
  },
];

export function Dashboard() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [groups, setGroups] = useState([]);

  // Rendu pour afficher les groupes
  const getGroups = async () => {
    getJwtToken((token) => {
      if(token != null) {
        fetch("http://localhost:8080/api/groups/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          }
        }).then(async (res) => {
          let data = await res.json();
          if(res.status === 200 && data) {
            setGroups(data.map(group => { return { id: group._id, name: group.nom, members: group.membres.map(member => member.nom_affiche) } }));
          }
          return Promise.reject(data);
        }).catch(error => console.log(error));
      } else {
        router.replace('/login');
      }
    })
  };
  useEffect(() => {
    getGroups();
  }, []);
  const renderGroupItems = () => {
    return groups.map((item) => {
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

  // Rendu pour afficher les alertes
  const renderAlertItems = () => {
    return ALERTDATA.map((item) => {
      const backgroundColor =
        item.id === selectedAlertId
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(255, 255, 255, 0.1)";

      return (
        <AlertItem
          key={item.id}
          item={item}
          onPress={() => setSelectedAlertId(item.id)}
          style={{ backgroundColor }}
        />
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.4 }}>
        <TitleText title={"Alerte en Cours"} />
        <ScrollView style={{ flex: 1 }}>{renderAlertItems()}</ScrollView>
      </View>
      <View style={{ flex: 0.6 }}>
        <TitleText title={"Mes Groupes"} />
        <ScrollView style={{ flex: 1 }}>
          { groups.length === 0
              ? <View style={styles.container}><Text style={styles.title}>Vous n'appartenez à aucun groupe.</Text></View>
              : renderGroupItems()
          }
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: "Montserrat_Medium",
    color: "white",
    marginTop: 30,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});