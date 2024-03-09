import React, {useState} from "react";
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
import * as FileSystem from "expo-file-system";
import {JWT_CACHE_FILE} from "../Utils";
import {router} from "expo-router";

export function RegisterScreen() {

    const [errorMsg, setErrorMsg] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function registerClk(event) {


        if (username && email && displayName && password && confirmPassword) {
            if (password === confirmPassword) {
                fetch("http://localhost:8080/api/users/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "userInfos": {
                            "nom": username,
                            "nom_affiche": displayName,
                            "email": email,
                            "password": password
                        }
                    }),
                }).then((res) => {
                    console.log(res);
                    return res.json();
                })
                    .then((data) => {
                        if (data.token == null) {
                            setErrorMsg(data.message)
                        } else {
                            FileSystem.writeAsStringAsync(JWT_CACHE_FILE, data.token, {encoding: 'utf8'})
                            router.replace('/dashboard');
                        }
                    }).catch((err) => {
                    setErrorMsg(err.message)
                });
            } else {
                setErrorMsg("Les mots de passe ne correspondent pas ")
            }
        } else {
            setErrorMsg("Veuillez remplir tous les champs")
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <ScrollView contentContainerStyle={styles.container}>
                <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>
                    <Image
                        contentFit="contain"
                        source={require("../assets/login-illustration.png")}
                        style={styles.image}
                    />
                    <ReturnButton/>

                    <Text style={styles.title}>Créer un Compte</Text>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                    <View style={{height: 30}}/>
                    <IconInput
                        value={username}
                        label={"Identifiant d'utilisateur"}
                        isPassword={false}
                        onValueUpdated={(text) => setUsername(text)}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        value={email}
                        label={"Adresse mail"}
                        isPassword={false}
                        onValueUpdated={(text) => setEmail(text)}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        value={displayName}
                        label={"Nom affiché"}
                        isPassword={false}
                        onValueUpdated={(text) => setDisplayName(text)}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        value={password}
                        label={"Mot de passe"}
                        isPassword={true}
                        onValueUpdated={(text) => setPassword(text)}
                    />
                    <View style={{height: 15}}/>
                    <IconInput
                        value={confirmPassword}
                        label={"Confirmer le mot de passe"}
                        isPassword={true}
                        onValueUpdated={(text) => setConfirmPassword(text)}
                    />
                    <View style={{height: 30}}/>
                    <GreenButton label={"Créer le compte"} onPress={registerClk} link={"/register"}/>
                    <View style={{height: 10}}/>
                    <TransparentButton label={"Se connecter"} link={"/login"}/>
                </LinearGradient>
            </ScrollView>
        </KeyboardAvoidingView>
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
    errorText: {
        color: "#E35050",
        textAlign: "center"
    }
});
