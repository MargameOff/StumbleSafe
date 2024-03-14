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

export function DashboardGroup() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groups, setGroups] = useState([]);

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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TitleText title={"Mes Groupes"} />
        <ScrollView style={{flex: 1}}>
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
