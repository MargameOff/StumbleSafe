import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function GroupItem({ item, onPress, style, checkable=false, isChecked=false }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>

            <View style={{flex: 1, flexGrow: 1}}>
                <View style={{flexDirection: "row", flexGrow: 1, width: "100%"}}>
                    <View style={{flexDirection: "column", width: "50%"}}>
                        <Text style={styles.title}>{item.name}</Text>


                        <Text style={styles.members}>
                            {/* Afficher les quatre premiers membres séparés par un espace */}
                            {item.members.slice(0, 4).join(", ")}

                            {/* Ajouter + (nombre total de membres - 4) autres si le nombre total de membres est supérieur à 4 */}
                            {item.members.length > 4 && ` + ${item.members.length - 4} autres`}
                        </Text>
                    </View>
                    <View style={{flexDirection: "column", width: "50%", justifyContent: "center", alignItems: "flex-end"}}>
                            { checkable ? 
                            <MaterialIcons style={{ justifyContent: "right" }} name={isChecked ? "check-box" : "check-box-outline-blank"} size={24} color="#fff" />
                            : <View></View> }
                    </View>
                </View>
            </View>

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
        width: "100%"
    },
});