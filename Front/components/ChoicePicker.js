import {Modal, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import ChoiceButton from './Buttons/ChoiceButton';

export default function ChoicePicker({ isVisible, onPress }) {
  return (
  <Modal animationType="slide" transparent={true} visible={isVisible}>
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.modalContent}>
            <ChoiceButton iconName="groups" text="Creer un groupe" redirectTo="group/creating"></ChoiceButton>
            <ChoiceButton iconName="arrow-right" text="Rejoindre un groupe" redirectTo="group/join"></ChoiceButton>
            <ChoiceButton iconName="list" text="Afficher les groupes" redirectTo="dashboard/groups"></ChoiceButton>
          </View>
        </ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
  );
}

const styles = StyleSheet.create({
    modalContent: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 10,
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });
  
