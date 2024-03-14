import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TripItem({ item, onPress, style }) {
    const [remainingTime, setRemainingTime] = useState(item.duration);
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = now - item.startDate.getTime();

            if ((item.duration - diff) <= 0) {
                clearInterval(interval);
                setRemainingTime(0);
            } else {
                setRemainingTime(item.duration - diff);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [item.startDate, item.duration]);
    const formatTime = (time) => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / 1000 / 60) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        const days = Math.floor(time / (1000 * 60 * 60 * 24));

        return (
            <View style={styles.countdownBox}>
                <Text style={styles.countdownTitle}>Arrive dans</Text>
                <Text style={styles.countdown}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                        <Text style={styles.countdownNumber}>{hours}</Text>
                        <Text style={styles.countdownDot}>:</Text>
                        <Text style={styles.countdownNumber}>{minutes}</Text>
                        <Text style={styles.countdownDot}>:</Text>
                        <Text style={styles.countdownNumber}>{seconds}</Text>
                    </View>
                </Text>
            </View>
        );
    };
    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={styles.title}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 3 }}>
                        <Image
                            source={require("../../assets/OIG.jpg")}
                            style={styles.userIcon}
                        />
                        <Text style={styles.user} numberOfLines={1}>{item.user}</Text>
                    </View>
                </View>
                <View style={{ alignSelf: 'center' }}>
                    {formatTime(remainingTime)}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    countdownBox: {
        backgroundColor: "#1E1E2D",
        padding: 10,
        borderRadius: 10,
        width: 120,
        alignItems: "center",
        justifyContent: "center",
        height: 80,
    },
    countdownTitle: {
        color: "green",
        fontFamily: "Montserrat_Bold",
        fontSize: 14,
        marginBottom: 10,
    },
    countdownNumber: {
        fontSize: 13,
        color: "white",
        fontFamily: "Montserrat_Regular",
        backgroundColor: "#292938",
        borderRadius: 5,
        padding: 6,
    },
    countdownDot: {
        fontSize: 14,
        paddingHorizontal: 5,
        color: "white",
        fontFamily: "Montserrat_Regular",
    },
    item: {
        padding: 10,
        marginVertical: 8,
        paddingVertical: 20,
        paddingHorizontal: 10,
        paddingLeft: 25,
        height: 100,
        borderRadius: 25,
    },
    name: {
        color: 'white',
        fontSize: 18,
    },
    title: {
        fontSize: 18,
        fontFamily: "Montserrat_Bold",
        color: "white",
        marginBottom: 7,
    },
    countdown: {
        color: 'white'
    },
    user: {
        color: 'white',
        fontSize: 14,
        fontFamily: "Montserrat_Bold",
    },
    userIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
});