import React from 'react'
import { Text } from 'react-native'

export default function TitleText({ title}) {

    return (
        <>
            <Text style={{ color: "white", fontSize: 32, textAlign: "left", fontFamily: "Montserrat_Regular" }}>{title}</Text>
        </>
    )
}
