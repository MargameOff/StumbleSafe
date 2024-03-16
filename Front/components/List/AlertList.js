import {ScrollView, StyleSheet, Text, View} from "react-native";
import TitleText from "../TitleText";
import React, {useEffect, useState} from "react";
import {getJwtToken} from "../../Utils";
import {router} from "expo-router";
import GroupItem from "../Items/GroupItem";
import TripItem from "../Items/TripItem";
import AlertItem from "../Items/AlertItem";

// TODO
// DONNEES DE TEST, A REMPLACER PAR LES DONNEES RECUPEREES DE L'API UNE FOIS CELLE-CI IMPLEMENTEE
const ALERTDATA = [
    {
        id: "1",
        type: "DANGER",
        user: {
            name: "@Chloé"
        },
        group: {
            name: "3IFA"
        }
    },
    {
        id: "2",
        type: "RETARD",
        user: {
            name: "@Gabriel"
        },
        group: {
            name: "Famille"
        }
    },
];

export default function AlertList({ size, isGroupRequired }) {
    const [selectedAlertId, setSelectedAlertId] = useState(null);
    const [alerts, setAlerts] = useState([]);

    const renderAlertItems = () => {
        return ALERTDATA.map((item) => {
            const getBackgroundColor = () => {
                if (item.type === "DANGER") {
                    return item.id === selectedAlertId
                        ? "rgba(237, 114, 114, 0.3)"
                        : "rgba(237, 114, 114, 0.1)";
                } if (item.type === "RETARD") {
                    return item.id === selectedAlertId
                        ? "rgba(217, 157, 98, 0.3)"
                        : "rgba(217, 157, 98, 0.1)";
                } else {
                    return item.id === selectedAlertId
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(255, 255, 255, 0.1)";
                }
            }

            return (
                <AlertItem
                    key={item.id}
                    item={item}
                    showGroupName={isGroupRequired}
                    onPress={() => setSelectedAlertId(item.id)}
                    style={{ backgroundColor: getBackgroundColor() }}
                />
            );
        });
    };

    return (
        <View style={ALERTDATA.length === 0 ? { flex: 0.25 } : { flex: size }}>
            <TitleText title={"Alertes"} />
            <ScrollView style={{flex: 1}}>
                { ALERTDATA.length === 0
                    ? <View style={styles.container}><Text style={styles.title}>Aucune alerte pour le moment.</Text></View>
                    : renderAlertItems()
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