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

    // Messsage de succès et d'erreur
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Récupération du profil
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


    // Modification du compte utilisateur
    const [displayName, setDisplayName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('')

    const updateProfile = async () =>
    {
        let updateRequests = [];

        if (displayName)
        {
            console.log("Requete de changement de nom affiché demandé : "+displayName)
            updateRequests.push(fetch("http://localhost:8080/api/users/update/name", {
                method:"PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":`{$token}`,
                },
                body: JSON.stringify({
                    nom_affiche: displayName
                }),
            }))
        }

        if (newPassword){
            console.log("Requete de changement de mot de passe demandé : oldPwd : "+oldPassword+" et newPwd : "+newPassword)
            updateRequests.push(fetch("http://localhost:8080/api/users/update/password"), {
                method:"PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`{$token}`
                },
                body: JSON.stringify({
                    password: oldPassword,
                    newPassword: newPassword
                })
            })
        }

        // Envoie de toute les requetes de modification
        console.log("Requetes")
        updateRequests.forEach(function (item, index, array) {
            console.log(item, index);
        });
        const responses = await Promise.all(updateRequests)
        console.log("Reponses")
        responses.forEach(function (item, index, array) {
            console.log(item, index);
        });
        // Vérifier les réponses et mettre à jour les messages de succès ou d'erreur
        const successResponses = responses.filter(response => response.ok);
        if (successResponses.length === updateRequests.length) {
            setSuccessMessage('Modifications enregistrées avec succès.');
        } else {
            setErrorMessage('Une erreur est survenue lors de l\'enregistrement des modifications.');
        }

    }

    return (
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <ScrollView contentContainerStyle={styles.container}>
                    <RoundImageViewer
                        placeholderImageSource={require("../assets/OIG.jpg")}
                    />
                    <ReturnButton/>
                    {/* Messages de succès ou d'erreur */}
                    {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}
                    {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
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
                                value={displayName}
                                onValueUpdated={(text) => setDisplayName(text)}
                                isPassword={false}
                                label={userInfo.nom_affiche}
                            />
                        </>
                        )}
                    <ParagraphText text={"Modification Mot de Passe"} />
                    <View style={{height: 15}}/>
                        <IconInput
                            value={oldPassword}
                            onValueUpdated={(text) => setOldPassword(text)}
                            isPassword={true}
                            label={"Ancien mot de passe"}
                        />
                    <View style={{height: 15}}/>
                    <IconInput
                        value={newPassword}
                        onValueUpdated={(text) => setNewPassword(text)}
                        isPassword={true}
                        label={"Nouveau mot de passe"}
                    />
                    <View style={{height: 30}}/>
                    <GreenButton label={"Modifier Compte"} onPress={updateProfile} link={"/user/account"}/>
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
    errorText: {
        color: "#E35050",
        textAlign: "center"
    },
    successText: {
        color: "#35bd0e",
        textAlign: "center"
    }
});
