import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ReturnButton from "../../../components/Buttons/ReturnButton";
import DateButton from "../../../components/Buttons/DateButton";
import GreenButton from "../../../components/Buttons/GreenButton";
import ChoiceGroup from "../../../components/ChoiceGroup";

export function CreateTripScreen() {

  // Region when we move on the map
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // Coordinate of the trip's end
  const [arrive, setArrive] = useState(null);
  
  const [dateArrive, setDateArrive] = useState(new Date());
  const [timeArrive, setTimeArrive] = useState(new Date());

  const [errorMsg, setErrorMsg] = useState('');

  const [groupSelection, setGroupSelection] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location;
      try {
        location = await Location.getCurrentPositionAsync({});
      } catch(err) {
        console.log(err)
      }

      console.log(location)
      setRegion({
        "latitude": location.coords.latitude,
        "longitude": location.coords.longitude
      })
    })();
  }, []);

  async function createTripClk(event) {
    if(arrive == null) {
      setErrorMsg("Séléctionner le lieu d'arrivée sur la map")
      return;
    }

    let estimatedArrive = new Date(dateArrive.getFullYear(), dateArrive.getMonth(), dateArrive.getDate(), timeArrive.getHours(), timeArrive.getMinutes()); 
    if(estimatedArrive <= (new Date())) {
      setErrorMsg("Vous devez séléctionner une date future !")
      return;
    }
    setGroupSelection(true);
    /*getJwtToken((token) => { 
      if(token != null) { // if token is null (never happen theoretically)
        fetch("http://localhost:8080/api/groups/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({
            "groupInfos": {
                "code": code,
            }
        }),
        }).then(async (res) => {
          const data = await res.json();
          if(res.status == 200) return data;
          return Promise.reject(data);
        })
        .then((data) => {
          router.replace('/dashboard');
        }).catch((err) => {
          setErrorMsg(err.message)
        });
      } else {
        router.replace('/login');
      }
    
    }) */
  }

  const onMapDrag = (region) => {
    setRegion(region);
  };

  const onPress = (region) => {
    setArrive(region.nativeEvent.coordinate);
  }; 

  const showDatePicker = (currentMode) => {
    const onChange = (event, selectedDate) => {
      setDateArrive(selectedDate);
    };

    DateTimePickerAndroid.open({
      value: dateArrive,
      onChange,
      mode: 'date',
      is24Hour: true,
    });
  };

  const showTimePicker = (currentMode) => {
    const onChange = (event, selectedDate) => {
      setTimeArrive(selectedDate);
    };

    DateTimePickerAndroid.open({
      value: timeArrive,
      onChange,
      mode: 'time',
      is24Hour: true,
    });
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={["#46294F", "#120721"]} style={styles.gradient}>

          <ReturnButton />
          <Text style={styles.title}>Nouveau Trajet</Text>
          <View style={{ height: 15 }} />

          <Text style={styles.text}>Séléctionner sur la map le lieu d'arrivée</Text>

          <View style={{ height: 15 }} />
          <Text style={{...styles.buttonText, ...styles.errorText}}>{errorMsg}</Text>
          <View style={{ height: 15 }} />

          <MapView
            showsUserLocation={true}
            userLocationUpdateInterval={10000}
            onRegionChange={onMapDrag}
            onPress={onPress}
            style={styles.map}
            zoomControlEnabled={true}
            zoomEnabled={true}
            provider={PROVIDER_GOOGLE}
          >

              { arrive != null ? 
              <View>
                <Marker
                coordinate={arrive}
                title="Point d'arrivée"
                />
              </View>
              : <View></View> }

          </MapView>

          <View style={{ height: 15 }} />
          <Text style={styles.text}>Séléctionner estimation de l'arrivée</Text>

          <View style={{flex: 1, flexDirection: "row", justifyContent: "center"}}>
            <DateButton value={dateArrive} show="date" onPress={showDatePicker} />
            <View style={{width: 20}} />
            <DateButton value={timeArrive} show="time" onPress={showTimePicker} />
          </View>

          <View style={{ height: 15 }} />
          <GreenButton label={"Créer"} link={"/user/createtrip"} onPress={createTripClk} />
          <View style={{ height: 10 }} />


        </LinearGradient>

        { groupSelection ? 
        <View style={{ flex: 1 }}>
          <ChoiceGroup isVisible={groupSelection} onPress={() => {}} />
        </View>
        : <View></View> }
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 26,
    color: "white",
    marginTop: 20,
  },
  text: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 17,
    color: "white",
  },
  container: {
    width: "100%",
    height: "100%"
  },
  gradient: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  buttonText: {
    color: "white",
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 16,
  },
  errorText: {
    color: "#E35050",
    fontSize: 16,
    textAlign: 'center'
  },
  map: {
    minWidth: 300,
    minHeight: 400,
    width: "90%",
    height: "50%"
  }
});
