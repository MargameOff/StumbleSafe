import Checkbox from 'expo-checkbox';
import { Text, StyleSheet, View } from "react-native";

export default function CheckBoxStumble({ text, isChecked, onChecked }) {
  return (
    <View style={styles.section}>
        <Checkbox 
        style={styles.checkbox} 
        value={isChecked}
        color={isChecked ? '#50E3A5' : undefined}
        onValueChange={onChecked} 
        />
        <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontFamily: "Montserrat_600SemiBold",
    color: 'white',
    fontSize: 15,
  },
  checkbox: {
    margin: 8
  },
});
