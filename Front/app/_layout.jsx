import { Stack } from "expo-router";import {
    Montserrat_100Thin,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    useFonts,
  } from "@expo-google-fonts/montserrat";

export default function Layout() {
    let [fontsLoaded] = useFonts({
        Montserrat_100Thin,
        Montserrat_300Light,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_800ExtraBold,
        Montserrat_900Black,
    });
    if (!fontsLoaded) {
        return null;
    }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >   
    </Stack>
  );
}
