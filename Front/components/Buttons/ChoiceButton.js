import { Link, router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from 'react-native'

export default function ChoiceButton({iconName, text, redirectTo}) {
    return (
        <TouchableOpacity onPress={() => router.push(redirectTo)} style={styles.item}>
          <View style={styles.container}>
            <View>
                <View style={styles.button}>
                  <MaterialIcons name={iconName} size={24} color="#fff" />
                </View>
            </View>
            <View>
              <Text style={styles.text}>{text}</Text>
            </View>
          </View>
        </TouchableOpacity>
    )
}

// On définit les styles du composant
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: "center",
      textAlignVertical: "center",
      borderRadius: 56,
    },
    button: {
      borderRadius: 50, // On rend le bouton rond en utilisant un grand rayon
      padding: 16,
    },
    text: {
      textAlignVertical: "center", 
      height: "100%",
      fontFamily: "Montserrat_Bold",
      color: "#fff"
    },
    item: {
        height: 60,
        borderColor: "#3BD0AC",
        borderWidth: 1,
        backgroundColor: "#2F1E45",
        borderRadius: 56,
        marginHorizontal: 20
    },
  });
  