import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import ChoiceButton from './Buttons/ChoiceButton';

export default function ChoicePicker({ isVisible, children, onClose }) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        
        <ScrollView style={styles.list}>
          <View style={styles.item}>
            <ChoiceButton iconName="groups" text="Creer un groupe" redirectTo="group/creating"></ChoiceButton>
          </View>
          <View style={styles.item}>
            <ChoiceButton iconName="arrow-right" text="Rejoindre un groupe" redirectTo="group/join"></ChoiceButton>
          </View>
          <View style={styles.item}>
            <ChoiceButton iconName="list" text="Afficher les groupes" redirectTo="dashboard/groups"></ChoiceButton>
          </View>
        </ScrollView>


      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalContent: {
      flexDirection: 'column',
      height: 'auto',
      width: '100%',
      backgroundColor: '#25292e',
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      position: 'absolute',
      bottom: 70,
      padding: 0,
      justifyContent: 'center',
      alignSelf: "center"
    },
    item: {
      height: 60,
      width: "100%",
      borderColor: "#3BD0AC",
      borderWidth: 1,
      backgroundColor: "#2F1E45B2",
      borderRadius: 56,
    }
  });
  
