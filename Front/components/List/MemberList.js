import {ScrollView, StyleSheet, Text, View} from "react-native";
import TitleText from "../TitleText";
import React, {useEffect, useState} from "react";
import {getJwtToken} from "../../Utils";
import {router} from "expo-router";
import GroupItem from "../Items/GroupItem";
import TripItem from "../Items/TripItem";
import MemberItem from "../Items/MemberItem";

export default function MemberList({ size, groupId }) {
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [members, setMembers] = useState([]);

    const getMembers = async () => {
        getJwtToken((token) => {
            if(token != null) {
                fetch(`http://localhost:8080/api/groups/${groupId}/members`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,
                    },
                }).then(async (res) => {
                    let data = await res.json();
                    if(res.status === 200 && data) {
                        setMembers(data);
                    }
                    return Promise.reject(data);
                }).catch(error => console.log(error));
            } else {
                router.replace('/login');
            }
        })
    };

    useEffect(() => {
        getMembers();
    }, []);

    const renderMemberItems = () => {
        return members.map((item) => {
            const backgroundColor =
                item._id === selectedMemberId
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(255, 255, 255, 0.1)";

            return (
                <MemberItem
                    key={item._id}
                    item={item}
                    onPress={() => setSelectedMemberId(item._id)}
                    style={{ backgroundColor }}
                />
            );
        });
    };

    return (
        <View style={members.length === 0 ? { flex: 0.25 } : { flex: size }}>
            <TitleText title={"Membres"} />
            <ScrollView style={{flex: 1}}>
                { members.length === 0
                    ? <View style={styles.container}><Text style={styles.title}>Aucun membre n'appartient à ce groupe.</Text></View>
                    : renderMemberItems()
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