import {ScrollView, StyleSheet, Text, View} from "react-native";
import TitleText from "../TitleText";
import React, {useEffect, useState} from "react";
import {getJwtToken} from "../../Utils";
import {router} from "expo-router";
import GroupItem from "../Items/GroupItem";
import TripItem from "../Items/TripItem";

export default function TripList({ size, groupId=null }) {
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [trips, setTrips] = useState([]);

    const fetchTrips = async (token) => {
        if (!groupId) {
            return fetch("http://localhost:8080/api/trips/getTrips", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                }
            });
        } else {
            return fetch(`http://localhost:8080/api/groups/${groupId}/trips`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            });
        }
    };

    const getTrips = async () => {
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
                }).then( currentUserId => {
                    fetchTrips(token)
                    .then(async (res) => {
                        let data = await res.json();
                        if(res.status === 200 && data) {
                            const currentDate = new Date();
                            setTrips(data.filter(trip => trip.utilisateur !== currentUserId)
                                .map(trip => {return {
                                    id: trip._id,
                                    name: trip.nom,
                                    duration: new Date(trip.date_arrivee_estimee) - currentDate,
                                    user: trip.nom_utilisateur,
                                    startDate: currentDate
                                }}));
                        }
                        return Promise.reject(data);
                    }).catch(error => console.log(error))
                }).catch(error => console.log(error));
            } else {
                router.replace('/login');
            }
        })
    };

    useEffect(() => {
        getTrips();
    }, []);

    const renderTripItems = () => {
        return trips.map((item) => {
            const backgroundColor =
                item.id === selectedTripId
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(255, 255, 255, 0.1)";

            return (
                <TripItem
                    key={item.id}
                    item={item}
                    onPress={() => setSelectedTripId(item.id)}
                    style={{ backgroundColor }}
                />
            );
        });
    };

    return (
        <View style={trips.length === 0 ? { flex: 0.25 } : { flex: size }}>
            <TitleText title={"Trajets en cours"} />
            <ScrollView style={{flex: 1}}>
                { trips.length === 0
                    ? <View style={styles.container}><Text style={styles.title}>Aucun trajet en cours.</Text></View>
                    : renderTripItems()
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