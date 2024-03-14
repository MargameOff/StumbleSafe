import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {router} from "expo-router";

export default function GroupHeader({ groupName, backCallback }) {
    const defaultBackCallback = () => router.back();
    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                <TouchableOpacity style={styles.backButton} onPress={backCallback ?? defaultBackCallback}>
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={[styles.centerContainer]}>
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 30,
                        color: "white",
                        fontFamily: "Montserrat_Medium",
                    }}
                >
                    {groupName}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 50,
        height: 60,
        flexWrap: "nowrap",
        marginBottom: 20,
    },
    leftContainer: {
        display: "inline",
        alignItems: "center",
        width: 55,
    },
    centerContainer: {
        flex: 1,
        marginLeft: 20,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    backButton: {
        backgroundColor: '#2F1E45',
        borderRadius: 50,
        padding: 16,
    },
});