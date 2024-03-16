import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MemberItem({ item, onPress, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 3 }}>
                        <Image
                            source={require("../../assets/OIG.jpg")}
                            style={styles.userIcon}
                        />
                        <Text style={styles.title} numberOfLines={1}>{item.nom_affiche}</Text>
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
        paddingHorizontal: 10,
        paddingLeft: 25,
        height: 50,
        borderRadius: 25,
    },
    title: {
        fontSize: 18,
        fontFamily: "Montserrat_Bold",
        color: "white",
        marginBottom: 7,
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