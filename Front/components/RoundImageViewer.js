import { StyleSheet, Image } from 'react-native';

export default function RoundImageViewer({ placeholderImageSource }) {
    return (
        <Image source={placeholderImageSource} style={styles.image} />
    );
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
        borderRadius: 99,
    },
});
