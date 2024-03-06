import { StyleSheet, Image } from 'react-native';

export default function RoundImageViewer({ placeholderImageSource }) {
    return (
        <Image source={placeholderImageSource} style={styles.image} />
    );
}

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        borderRadius: 99,
    },
});
