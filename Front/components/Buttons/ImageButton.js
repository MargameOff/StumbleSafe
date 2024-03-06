import {Image, Pressable } from "react-native";
import { Link } from "expo-router";

export default function ImageButton({link, onPress, source , imageStyle}) {
    return (
        <Link href={link} asChild>
        <Pressable
            onPress={onPress}
            style={( {pressed}) =>  {
                return {opacity: pressed ? 0.7 : 1}
            }}>
            <Image style={imageStyle} source={source} />
        </Pressable>
        </Link>
    );
}
