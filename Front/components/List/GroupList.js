import {ScrollView, StyleSheet, Text, View} from "react-native";
import TitleText from "../TitleText";
import React, {useEffect, useState} from "react";
import {getJwtToken} from "../../Utils";
import {router} from "expo-router";
import GroupItem from "../Items/GroupItem";

export default function GroupList({ size }) {
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groups, setGroups] = useState([]);

    const getGroups = async () => {
        getJwtToken((token) => {
            if(token != null) {
                fetch("http://localhost:8080/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    }
                }).then(async (res) => {
                    let data = await res.json();
                    if(res.status === 200 && data) {
                        return data._id;
                    }
                    return Promise.reject(data);
                }).then( currentUserId =>
                    fetch("http://localhost:8080/api/groups/", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token,
                        }
                    }).then(async (res) => {
                        let data = await res.json();
                        if(res.status === 200 && data) {
                            setGroups(data.map(group => {return {
                                id: group._id,
                                name: group.nom,
                                code: group.code,
                                isCurrentUserOwner: group.membres.some(member => member._id === currentUserId && member.proprietaire),
                                members: group.membres.map(member => member.nom_affiche)
                            }}));
                        }
                        return Promise.reject(data);
                    }).catch(error => console.log(error))
                ).catch(error => console.log(error));
            } else {
                router.replace('/login');
            }
        })
    };

    useEffect(() => {
        getGroups();
    }, []);

    const renderGroupItems = () => {
        return groups.map((item) => {
           const backgroundColor =
                item.id === selectedGroupId
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(255, 255, 255, 0.1)";

            const selectGroupItem = () => {
                setSelectedGroupId(item.id);
                router.push({ pathname: 'group/details', params: { id: item.id, name: item.name, code: item.code, isCurrentUserOwner: item.isCurrentUserOwner } });
            };

            return (
                <GroupItem
                    key={item.id}
                    item={item}
                    onPress={selectGroupItem}
                    style={{ backgroundColor }}
                />
            );
        });
    };

    return (
        <View style={groups.length === 0 ? { flex: 0.25 } : { flex: size }}>
            <TitleText title={"Mes Groupes"} />
            <ScrollView style={{flex: 1}}>
                { groups.length === 0
                    ? <View style={styles.container}><Text style={styles.title}>Vous n'appartenez à aucun groupe.</Text></View>
                    : renderGroupItems()
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
    },
    title: {
        fontSize: 18,
        fontFamily: "Montserrat_Medium",
        color: "white",
        marginTop: 30,
    },
});