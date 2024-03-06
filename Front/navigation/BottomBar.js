import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, router, useNavigationContainerRef } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function BottomBar() {
    const navigation = useNavigation();
    console.log(useNavigationContainerRef().getCurrentRoute().name);
    useNavigation().getParent()
    return (
        <LinearGradient
            colors={["rgba(65,37,73,1)", "rgba(65,37,73,0.29)"]}
            style={styles.container}
        >

            <TouchableOpacity onPress={() => router.push("login")}>
                <Ionicons name="home-outline" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("register")}>
                <View style={styles.subButton}/>
                <Ionicons name="add-circle" style={styles.button} size={90} color="#50E3A5" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Ionicons name="people" size={32} color="white" />
            </TouchableOpacity>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        height: 70,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    button: {
        position: "absolute",
        left: "50%",
        transform: [{ translateX: -45 }], // Décaler de moitié de la largeur du bouton vers la gauche
        bottom: -10, // Ajustement de la position verticale du bouton
    },
    subButton: {
        position: "absolute",
        width: 70,
        height: 70,
        backgroundColor: "white",
        borderRadius: 70,
        bottom: 0,
        left: "50%",
        transform: [{ translateX: -35 }], // Décaler de moitié de la largeur du sous-bouton vers la gauche
    },

});
