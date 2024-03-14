import React, {useState} from "react";
import {
    View,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {router, useLocalSearchParams} from "expo-router";
import IconInput from "../../components/IconInput";
import GreenButton from "../../components/Buttons/GreenButton";
import GroupHeader from "../../components/Headers/GroupHeader";
import {getJwtToken} from "../../Utils";
import {createEntryFileAsync} from "expo-router/build/onboard/createEntryFile";
import {Image} from "expo-image";
import {vh, vw} from "react-native-expo-viewport-units";

export function ModificationGroupScreen() {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const groupParam = useLocalSearchParams();
    const [group, setGroup] = useState(groupParam);
    const [groupName, setGroupName] = useState(group.name);

    const updateGroup = async () => {
        getJwtToken((token) => {
            if(token != null) {
                fetch("http://localhost:8080/api/groups/group-info", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    },
                    body: JSON.stringify({
                        groupInfos: {
                            nom: groupName,
                            code: group.code
                        }
                    }),
                }).then(async (res) => {
                    let data = await res.json();
                    if(res.status === 200 && data) {
                        setGroup({ id: group.id, name: groupName, code: group.code });
                        setSuccessMessage('Modifications enregistrées avec succès.');
                    } else {
                        setErrorMessage('Une erreur est survenue lors de l\'enregistrement des modifications.');
                    }
                    return Promise.reject(data);
                }).catch(error => console.log(error));
            } else {
                router.replace('/login');
            }
        })
    };

    const backCallback = () => {
        router.back();
        router.back();
        router.push({ pathname: 'group/details', params: group });
    };

    return (
        <LinearGradient colors={["#46294F", "#120721"]} style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <GroupHeader groupName={group.name} backCallback={backCallback} />
                        <View style={{ flex: 1 }}>
                            <Image
                                contentFit="contain"
                                source={require("../../assets/logo/logo.png")}
                                style={styles.image}
                            />
                            {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}
                            {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
                            <View style={{ alignItems: "center", paddingBottom: 30 }}>
                                <Text
                                    style={{
                                        fontSize: 30,
                                        color: "white",
                                        fontFamily: "Montserrat_Bold",
                                        textAlign: "center"
                                    }}
                                >
                                    {"Modifier le nom du groupe"}
                                </Text>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <IconInput
                                    value={groupName}
                                    onValueUpdated={(text) => setGroupName(text)}
                                    isPassword={false}
                                    label={"Nom du groupe"}
                                />
                            </View>
                            <View style={{ alignItems: "center", paddingTop: 30 }} >
                                <GreenButton label={"Modifier le groupe"} onPress={updateGroup} link={"/group/modification"}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        flexDirection: "column",
        alignItems: "center"
    },
    errorText: {
        color: "#E35050",
        textAlign: "center",
        paddingBottom: 25,
    },
    successText: {
        color: "#35bd0e",
        textAlign: "center",
        paddingBottom: 25,
    },
    image: {
        width: vw(100),
        height: vh(35),
    },
});
