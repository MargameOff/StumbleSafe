import { Link } from "expo-router";
import { Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

export default function GreenButton({ label, link, onPress }) {
  return (
    <Link href={link} asChild >
      <Button
        title={label}
        loading={false}
        onPress={onPress}
        loadingProps={{ size: "small", color: "white" }}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ["#50E3A5", "#20B680"],
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 },
        }}
        buttonStyle={{
          borderRadius: 100,
          height: 55,
        }}
        titleStyle={{
          fontFamily: "Montserrat_600SemiBold",
          fontSize: 16,
        }}
        containerStyle={{
          width: 230,
        }}
      />
    </Link>
  );
}