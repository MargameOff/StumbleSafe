import { Link } from "expo-router";
import { Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Button to select a date or time
 * @param {Date} value
 * @param {String} either "date" or "time"
 * @param {function} onPress
 * @returns 
 */
export default function DateButton({ value, show="date", onPress }) {
  if(show == "time") {
    value = value.getHours()+"h"+value.getMinutes();
  } else if(show == "date") {
    value = value.getDate()+"/"+value.getMonth()+"/"+value.getFullYear();
  }

  return (
      <Button
        title={value}
        loading={false}
        onPress={onPress}
        loadingProps={{ size: "small", color: "white" }}
        buttonStyle={{
          height: 55
        }}
        titleStyle={{
          fontFamily: "Montserrat_600SemiBold",
          fontSize: 16,
        }}
        containerStyle={{
          width: "auto",
        }}
      />
  );
}