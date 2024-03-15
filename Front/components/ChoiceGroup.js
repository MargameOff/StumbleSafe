import { Modal, View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import TitleText from './TitleText';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { getJwtToken } from '../Utils';
import GroupItem from './Items/GroupItem';
import GreenButton from './Buttons/GreenButton';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Create a component to pick up groups
 * @param boolean isVisible true : show modal / false : hide
 * @param function onValidate callback function which returns list of selecting groups when we click on validate
 * @param function onPressClose callback function when we press close button
 * @returns 
 */
export default function ChoiceGroup({ isVisible, onValidate, onPressClose }) {
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
    if(selectedGroupIds.includes(item.id)) {
      let newSelectedGroups = [...selectedGroupIds];
      for (let i = 0; i < newSelectedGroups.length; i++) { 
        if (newSelectedGroups[i] === item.id) { 
          newSelectedGroups.splice(i, 1);
        }
      }
      setSelectedGroupIds(newSelectedGroups);
    } else {
      setSelectedGroupIds([...selectedGroupIds, item.id]);
    }
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
          onPress={() => onSelectGroup(item)}
          style={{ backgroundColor }}
        />
      );
    });
  };

  return (
    <Modal animationType="slide" transparent={false} style={{flex: 1}} visible={isVisible}>
      <LinearGradient style={{height: "100%"}} colors={["#46294F", "#120721"]}>

        <View style={styles.modalContent}>
            
          <View style={styles.closeBntContainer}>
              <TouchableOpacity style={styles.button} onPress={onPressClose}>
                  <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
          </View>

          <View style={{
            alignItems: 'center',
            justifyContent: 'center'
            }}>
              <TitleText title={"Mes Groupes"} />

              <ScrollView style={{width: "100%", height: "80%", maxHeight: "80%", paddingLeft: 10, paddingRight: 10}}>
                { groups.length === 0
                    ? <View style={styles.container}>
                      <Text style={styles.title}>Vous n'appartenez à aucun groupe.</Text>
                      </View>
                    : renderGroupItems()
                }

              </ScrollView>
              <GreenButton label="Valider" link="/user/createtrip" onPress={() => onValidate(selectedGroupIds)} />
          </View>

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
    },
    closeBntContainer: {
      position: 'relative',
      top: 25,
      left: 0,
      margin: 22,
    },
  });
  
