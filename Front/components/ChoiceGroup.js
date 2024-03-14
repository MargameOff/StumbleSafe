import { Modal, View, StyleSheet, ScrollView, Text } from 'react-native';
import TitleText from './TitleText';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { getJwtToken } from '../Utils';
import GroupItem from './Items/GroupItem';
import GreenButton from './Buttons/GreenButton';

/**
 * TO DO !
 */
export default function ChoiceGroup({ isVisible, onPress }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);

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
          console.log(data)
          if(res.status === 200 && data) {
            setGroups(data.map(group => { return { id: group._id, name: group.nom, members: group.membres.map(member => member.nom_affiche) } }));
            console.log(groups)
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

  const onSelectGroup = (item) => {
    let operation = "";
     
    if(selectedGroupIds.includes(item.id)) {
      operation = "add";
      let newSelectedGroups = [item.id];
      newSelectedGroups = newSelectedGroups.concat(selectedGroupIds);
      setSelectedGroupIds(newSelectedGroups);
      console.log(selectedGroupIds)
    } else {
      let newSelectedGroups = [...selectedGroupIds];
      operation = "delete";
      for (let i = 0; i < newSelectedGroups.length; i++) { 
        if (newSelectedGroups[i] === item.id) { 
          newSelectedGroups.splice(i, 1);
        }
      }
      setSelectedGroupIds(newSelectedGroups);
    }
    console.log(selectedGroupIds)
    onPress(item.id, operation)
  }

  const renderGroupItems = () => {
    return groups.map((item) => {
      const backgroundColor =
        selectedGroupIds.includes(item.id)
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(255, 0, 0, 0.1)";

      return (
        <GroupItem
          key={item.id}
          item={item}
          onPress={() => onSelectGroup(item.id)}
          style={{ backgroundColor }}
        />
      );
    });
  };

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible}>
      <LinearGradient style={{height: "100%"}} colors={["#46294F", "#120721"]}>

        <View style={styles.modalContent}>
          
          <TitleText title={"Mes Groupes"} />
          <ScrollView>
            { groups.length === 0
                ? <View style={styles.container}>
                  <Text style={styles.title}>Vous n'appartenez à aucun groupe.</Text>
                  </View>
                : renderGroupItems()
            }

            <GreenButton label="Valider" link="/user/createtrip" onPress={() => {}} />
          </ScrollView>


        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalContent: {
      flexDirection: 'column',
      height: 'auto',
      width: '100%',
     // backgroundColor: '#25292e',
      justifyContent: 'center',
      alignSelf: "center"
    },
    item: {
      height: 60,
      width: "100%",
      borderColor: "#3BD0AC",
      borderWidth: 1,
      backgroundColor: "#2F1E45B2",
      borderRadius: 56,
    },
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
    }
  });
  
