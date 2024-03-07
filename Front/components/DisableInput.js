import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function IconInput({ value, defaultValue = '', onValueUpdated, isPassword = false, label, disabled }) {
    const containerStyle = disabled ? [styles.container, styles.disabled] : styles.container;
    const inputStyle = disabled ? [styles.input, styles.disabledText] : styles.input;

    return (
        <View style={containerStyle}>
            <MaterialIcons name={isPassword ? "lock" : "person"} size={24} color="#ababab" />
            <TextInput
                style={inputStyle}
                placeholder={label}
                placeholderTextColor="#ababab"
                value={value !== '' ? value : defaultValue}
                onChangeText={text => onValueUpdated(text)}
                secureTextEntry={isPassword}
                editable={!disabled} // Désactive la saisie si le composant est désactivé
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5A3E85',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
    },
    input: {
        color: '#ababab',
        marginLeft: 10,
        fontSize: 15,
        flex: 1,
    },
    disabled: {
        opacity: 0.5, // Réduit l'opacité pour indiquer que le composant est désactivé
    },
    disabledText: {
        color: '#808080', // Change la couleur du texte pour indiquer que le composant est désactivé
    },
});
