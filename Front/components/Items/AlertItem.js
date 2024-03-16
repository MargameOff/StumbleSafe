import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";

export default function AlertItem({ item, onPress, style, showGroupName }) {
    const dangerColor = "#CE3A3A";
    const lateColor = "#EA921F";

    const renderIcon = () => {
        if (item.type === "DANGER") {
            return <MaterialIcons name={"report-problem"} size={24} color={dangerColor} />;
        }
        if (item.type === "RETARD") {
            return <MaterialIcons name={"watch-later"} size={24} color={lateColor} />;
        }
    }

    const renderColor = () => {
        if (item.type === "DANGER") {
            return dangerColor;
        }
        if (item.type === "RETARD") {
            return lateColor;
        }
    }

    const renderDescription = () => {
        if (item.type === "DANGER") {
            return " a rencontré un problème sur son trajet.";
        }
        if (item.type === "RETARD") {
            return " est en retard : l'arrivée a destination n'a pas encore été validée.";
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
            <View style={styles.header}>
                {renderIcon()}
                <Text style={[styles.title, { color: renderColor() }]}>{item.type}</Text>
                {showGroupName && <Text style={[styles.title, { color: "#fff", paddingLeft: 5}]}>{item.group.name}</Text>}
            </View>
            <Text style={styles.description}>
                <Text style={styles.user} numberOfLines={1}>
                    {item.user.name}
                </Text>
                {renderDescription()}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    header: {
        flex:1,
        flexDirection: "row",
        gap: 5
    },
    item: {
        flex: 1,
        padding: 10,
        marginVertical: 8,
        paddingVertical: 20,
        paddingHorizontal: 25,
        height: 110,
        borderRadius: 25,
    },
    title: {
        fontSize: 18,
        fontFamily: "Montserrat_Bold",
    },
    user: {
        flex: 1,
        fontFamily: "Montserrat_Bold",
        fontSize: 14,
        color: "white",
    },
    description: {
        flex: 1,
        fontFamily: "Montserrat_Medium",
        fontSize: 14,
        color: "white",
    },
});