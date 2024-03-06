import { Slot, Stack } from "expo-router";
import { useFonts } from "@expo-google-fonts/montserrat";
import { Text } from "react-native";

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat_Thin': require("../assets/fonts/Montserrat-Thin.ttf"),
    'Montserrat_ExtraLight': require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    'Montserrat_Light': require("../assets/fonts/Montserrat-Light.ttf"),
    'Montserrat_Regular': require("../assets/fonts/Montserrat-Regular.ttf"),
    'Montserrat_Medium': require("../assets/fonts/Montserrat-Medium.ttf"),
    'Montserrat_SemiBold': require("../assets/fonts/Montserrat-SemiBold.ttf"),
    'Montserrat_Bold': require("../assets/fonts/Montserrat-Bold.ttf"),
    'Montserrat_ExtraBold': require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    'Montserrat_Black': require("../assets/fonts/Montserrat-Black.ttf"),
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      ></Stack>
  );
}
