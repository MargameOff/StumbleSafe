import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    ScrollView, TextInput,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {vw, vh} from "react-native-expo-viewport-units";
import GreenButton from "../components/Buttons/GreenButton";
import IconInput from "../components/IconInput";
import ReturnButton from "../components/Buttons/ReturnButton";
import RoundImageViewer from "../components/RoundImageViewer";
import {getJwtToken} from "../Utils";
import DisableInput from "../components/DisableInput";
import ParagraphText from "../components/ParagraphText";

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
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [displayName, setDisplayName] = useState('');

    // Récupération du profile
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


    // Modification du compte utilisateur
    // const updateProfile = async () =>
    // {
    //     const updateRequests = [];
    //
    //     if (userInfo.nom_affiche)
    //     {
    //         updateRequests.push(fetch("http://localhost:8080/api/users/update/name", {
    //             method:"PATCH",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization":`{$token}`,
    //             },
    //             body: JSON.stringify({
    //                 nom_affiche:userInfo.nom_affiche
    //             }),
    //         }))
    //     }
    //
    //     if (userInfo.newPassword){
    //         updateRequests.push(fetch("http://localhost:8080/api/users/update/password"), {
    //             method:"PATCH",
    //             headers: {
    //                 "Content-Type":"application/json",
    //                 "Authorization":`{$token}`
    //             },
    //             body: JSON.stringify({
    //                 password: userInfo.password,
    //                 newPassword: new_password
    //             })
    //         })
    //     }
    //
    //     // Envoie de toute les requetes de modification
    //     const responses = await Promise.all(updateRequests)
    //
    //     // Vérifier les réponses et mettre à jour les messages de succès ou d'erreur
    //     const successResponses = responses.filter(response => response.ok);
    //     if (successResponses.length === updateRequests.length) {
    //         setSuccessMessage('Modifications enregistrées avec succès.');
    //     } else {
    //         setErrorMessage('Une erreur est survenue lors de l\'enregistrement des modifications.');
    //     }
    //
    // }

    return (
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <ScrollView contentContainerStyle={styles.container}>
                    <RoundImageViewer
                        placeholderImageSource={require("../assets/OIG.jpg")}
                    />
                    <ReturnButton/>
                    {/* Messages de succès ou d'erreur */}
                    {successMessage !== '' && <Text>{successMessage}</Text>}
                    {errorMessage !== '' && <Text>{errorMessage}</Text>}
                    <View style={{height: 30}}/>
                    {userInfo && (
                        <>
                            <ParagraphText text={"Nom d'utilisateur"} />
                            <DisableInput
                            varName="nom"
                            label={userInfo.nom}
                            isPassword={false}
                            disabled={true}
                            value={userInfo.nom}
                        />
                        <View style={{height: 15}}/>
                            <ParagraphText text={"Email"} />
                            <DisableInput
                                varName={"email"}
                                label={userInfo.email}
                                isPassword={false}
                                disabled={true}
                                value={userInfo.email}
                            />
                        <View style={{height: 15}}/>
                            <ParagraphText text={"Nom affiché"} />
                            <IconInput
                                value={userInfo.nom_affiche}
                                placeholder="Nom affiché"
                                onChangeText={setDisplayName}
                                isPassword={false}
                                label={userInfo.nom_affiche}
                            />
                        </>
                        )}
                    <ParagraphText text={"Modification Mot de Passe"} />
                    <View style={{height: 15}}/>
                        <IconInput
                            varName={"motDePasse"}
                            label={"Mot de passe actuel"}
                            isPassword={true}
                        />
                    <View style={{height: 15}}/>
                    <IconInput
                        varName={"confirmMotDePasse"}
                        label={"Nouveau mot de passe"}
                        isPassword={true}
                    />
                    <View style={{height: 30}}/>
                    <GreenButton label={"Modifier Compte"} onClick={() => console.log(displayName)} link={"/dashboard"}/>
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
    input: {
        color: '#ababab',
        marginLeft: 10,
        fontSize: 15,
        flex: 1,
    }
});
