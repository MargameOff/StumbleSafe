import { Link, router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ReturnButton() {
    const handlePress = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

// On définit les styles du composant
const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 25,
      left: 0,
      margin: 22,
    },
    button: {
      backgroundColor: '#2F1E45',
      borderRadius: 50, // On rend le bouton rond en utilisant un grand rayon
      padding: 16,
    },
  });
  