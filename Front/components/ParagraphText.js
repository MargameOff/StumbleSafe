import React from 'react'
import { Text } from 'react-native'

export default function ParagraphText({ text}) {

    return (
        <>
            <Text style={{ color: "white", fontSize: 20, textAlign: "left", fontFamily: "Montserrat_Regular" }}>{text}</Text>
        </>
    )
}