import { Link } from "expo-router";
import { Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableWithoutFeedback } from "react-native";

export default function TransparentButton({ label, link }) {
  return (
    <Link href={link} asChild>
          <Button
            TouchableComponent={TouchableWithoutFeedback}
            title={label}
            buttonStyle={{
              borderRadius: 100,
              backgroundColor: "transparent",
            }}
            titleStyle={{
              fontFamily: "Montserrat_600SemiBold",
              fontSize: 16,
              color: "#ababab",
            }}
            containerStyle={{
              width: 230,
            }}
          />
        </Link>
  )
}