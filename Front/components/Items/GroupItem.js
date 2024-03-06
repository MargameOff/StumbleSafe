import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function GroupItem({ item, onPress, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.members}>
                {/* Afficher les quatre premiers membres séparés par un espace */}
                {item.members.slice(0, 4).join(", ")}
                {/* Ajouter + (nombre total de membres - 4) autres si le nombre total de membres est supérieur à 4 */}
                {item.members.length > 4 && ` + ${item.members.length - 4} autres`}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        padding: 10,
        marginVertical: 8,
        paddingVertical: 20,
        paddingHorizontal: 25,
        height: 100,
        borderRadius: 25,
    },
    title: {
        fontSize: 18,
        fontFamily: "Montserrat_Bold",
        color: "white",
    },
    members: {
        fontFamily: "Montserrat_Medium",
        fontSize: 14,
        color: "white",
    },
});