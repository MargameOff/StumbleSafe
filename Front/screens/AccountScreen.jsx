import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {vw, vh} from "react-native-expo-viewport-units";
import GreenButton from "../components/Buttons/GreenButton";
import TransparentButton from "../components/Buttons/TransparentButton";
import IconInput from "../components/IconInput";
import ReturnButton from "../components/Buttons/ReturnButton";
import RoundImageViewer from "../components/RoundImageViewer";
import {getJwtToken, JWT_CACHE_FILE} from "../Utils";
import DisableInput from "../components/DisableInput";

async function getProfile(token) {
    const url = "http://localhost:8080/api/users/profile";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
            },
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}


export function AccountScreen() {

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        getJwtToken((token) => {
            console.log("Token : "+token)

            const url = "http://localhost:8080/api/users/profile";

            getProfile(token)
                .then(data => {
                    console.log(data);
                    setUserInfo(data);      // mettre a jour donnée utilisateur
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });
        });
    }, []);

    return (
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <ScrollView contentContainerStyle={styles.container}>
                    <RoundImageViewer
                        placeholderImageSource={require("../assets/OIG.jpg")}
                    />
                    <ReturnButton/>
                    <View style={{height: 30}}/>
                    {userInfo && (
                        <>
                        <DisableInput
                            varName="nom"
                            label={userInfo.nom}
                            isPassword={false}
                            disabled={true}
                        />
                        <View style={{height: 15}}/>
                        <DisableInput
                            varName={"email"}
                            label={userInfo.email}
                            isPassword={false}
                            disabled={true}
                        />
                        <View style={{height: 15}}/>
                        <DisableInput
                            varName={"nomUtilisateur"}
                            label={userInfo.nom_affiche}
                            isPassword={false}
                            disabled={false}
                        />
                        </>
                        )}
                    <View style={{height: 15}}/>
                    <IconInput
                        varName={"motDePasse"}
                        label={"Mot de passe actuel"}
                        isPassword={true}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        varName={"confirmMotDePasse"}
                        label={"Confirmer le nouveau mot de passe"}
                        isPassword={true}
                    />
                    <View style={{height: 30}}/>
                    <GreenButton label={"Modifier Compte"} link={"/dashboard"}/>
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
        justifyContent: "center",
        width: "100%",
    },
    image: {
        width: vw(100),
        height: vh(35),
        marginTop: -50,
        marginBottom: -50,
    },
});
