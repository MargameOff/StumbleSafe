import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import { useNavigation, router, useSegments, useNavigationContainerRef } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import ChoicePicker from "../components/ChoicePicker";
import { useEffect } from "react";

export default function GroupBottomBar({ group }) {
    console.log(useNavigationContainerRef().getCurrentRoute().name);
    useNavigation().getParent()
    const renderLeaveIcon = () => {
        console.log(typeof group.isCurrentUserOwner);
        if (group.isCurrentUserOwner === "true") {
            return (
                <TouchableOpacity onPress={() => router.push({ pathname: 'group/delete', params: group })}>
                    <MaterialIcons name="delete" size={32} color="white" />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={() => router.push({ pathname: 'group/leave', params: group })}>
                    <MaterialIcons name="group-remove" size={32} color="white" />
                </TouchableOpacity>
            );
        }
    }

    return (
        <View>
            <LinearGradient
                colors={["rgba(65,37,73,1)", "rgba(65,37,73,0.29)"]}
                style={styles.container}
            >
                <TouchableOpacity onPress={() => router.push({ pathname: 'group/members', params: group })}>
                    <MaterialIcons name="group" size={32} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push({ pathname: 'group/code', params: group })}>
                    <MaterialIcons name="group-add" size={32} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push({ pathname: 'group/modification', params: group })}>
                    <MaterialIcons name="edit" size={32} color="white" />
                </TouchableOpacity>

                {renderLeaveIcon()}

            </LinearGradient>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        height: 70,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
});
