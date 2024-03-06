import React from "react";
import {
    View,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import {vw, vh} from "react-native-expo-viewport-units";
import GreenButton from "../components/Buttons/GreenButton";
import TransparentButton from "../components/Buttons/TransparentButton";
import IconInput from "../components/IconInput";
import ReturnButton from "../components/Buttons/ReturnButton";
import RoundImageViewer from "../components/RoundImageViewer";

export function AccountScreen() {
    return (
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <ScrollView contentContainerStyle={styles.container}>
                    <RoundImageViewer
                        placeholderImageSource={require("../assets/OIG.jpg")}
                    />
                    <ReturnButton/>

                    <Text style={styles.title}>Information du compte</Text>
                    <View style={{height: 30}}/>
                    <IconInput
                        varName={"identifiant"}
                        label={"Identifiant d'utilisateur"}
                        isPassword={false}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        varName={"email"}
                        label={"Adresse mail"}
                        isPassword={false}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        varName={"nomUtilisateur"}
                        label={"Nom d'utilisateur"}
                        isPassword={false}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        varName={"motDePasse"}
                        label={"Mot de passe"}
                        isPassword={true}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        varName={"confirmMotDePasse"}
                        label={"Confirmer le mot de passe"}
                        isPassword={true}
                    />
                    <View style={{height: 30}}/>
                    <GreenButton label={"Créer le compte"} link={"/home"}/>
                    <View style={{height: 10}}/>
                    <TransparentButton label={"Se connecter"} link={"/login"}/>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 35,
        color: "white",
        marginTop: 20,
    },
    container: {
        flexGrow: 1,
        alignItems: "center",
        width: "100%",
    },
    image: {
        width: vw(100),
        height: vh(35),
        marginTop: -50,
        marginBottom: -50,
    },
});
