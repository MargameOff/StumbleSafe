import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Modal from "react-native-modal";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect } from 'react';

export default function Notification({ duration, icon, iconColor="#fff", text, isVisible }) {
  const [isModalVisible, setModalVisible] = useState(isVisible);

  useEffect(() => {
      setTimeout(() => {
          setModalVisible(false)
      }, duration*1000);
  }, []);

  return (
    <Modal swipeDirection={['up', 'right']}
    backdropOpacity={0}
    isVisible={isModalVisible}
    onBackdropPress={() => setModalVisible(false)}
    onSwipeComplete={() => setModalVisible(false)}
    animationIn='slideInDown' 
    animationOut='slideOutUp'>
      <View style={{ ...styles.modalContent, borderColor: iconColor }}>
        <MaterialIcons name={icon} color={iconColor} size={36} />
        <Text ellipsizeMode="tail" style={styles.text}>{text}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalContent: {
      position: "absolute",
      top: 0,
      height: "auto",
      flexDirection: "row", 
      alignItems: "center",
      borderRadius: 56,
      backgroundColor: "#0000007E",
      borderRadius: 26,
      width: "100%",
      paddingTop: 5,
      paddingBottom: 5,
      borderWidth: 1
    },
    text: {
      flex: 1,
      flexWrap: 'wrap',
      fontFamily: "Montserrat_Regular",
      fontSize: 16,
      color: "#fff",
      marginLeft: 8,
      paddingRight: 8
    }
  });
  
