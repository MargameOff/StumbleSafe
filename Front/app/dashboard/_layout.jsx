import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Slot, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomBar from "../../navigation/BottomBar";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import { JWT_CACHE_FILE } from "../../Utils";
import ImageButton from "../../components/Buttons/ImageButton";

export default function Layout() {
  function disconnectClk() {
    FileSystem.deleteAsync(JWT_CACHE_FILE);
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#46294F", "#120721"]} style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 20, flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.leftContainer}>
              <ImageButton
                  link="/user/account"
                onPress={()=>console.log("Button")}
                source={require("../../assets/OIG.jpg")}
                imageStyle={styles.userIcon}
              />
              </View>
              <View style={[styles.centerContainer, { flex: 1 }]}>
                <Text
                  style={{
                    fontSize: 30,
                    color: "white",
                    fontFamily: "Montserrat_Medium",
                    width: 200,
                  }}
                >
                  StumbleSafe
                </Text>
              </View>
              <View style={styles.rightContainer}>
                <Ionicons
                  name="log-out-outline"
                  size={42}
                  color="white"
                  style={styles.menuIcon}
                  onPress={() => {disconnectClk(); router.replace("/home")}}
                />
              </View>
            </View>
            <Slot name="main" />
          </View>
        </View>
        <BottomBar />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    height: 60,
    flexWrap: "nowrap",
    marginBottom: 20,
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
