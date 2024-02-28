import React, { useState } from 'react';
import { Button } from "@rneui/themed";
import { StyleSheet, TextInput, Text, TouchableWithoutFeedback, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';


export default function IconInput({ varName, isPassword = false, label}) {
  const [inputValues, setInputValues] = useState({});
  const handleInputChange = (_varName, text) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [_varName]: text
    }));
  };

  return (
    <View style={styles.container}>
      <MaterialIcons name={isPassword ? "lock" : "person"} size={24} color="#ababab" />
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#ababab"
        value={inputValues[varName] || ''}
        onChangeText={text => handleInputChange(varName, text)}
        secureTextEntry = {isPassword}
      />
    </View>
  )
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
});