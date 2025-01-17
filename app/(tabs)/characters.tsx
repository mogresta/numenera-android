import UserCharacters from "@/components/UserCharacters";
import React from "react";
import styles from "@/constants/Styles";
import {LinearGradient} from "expo-linear-gradient";
import BackButton from "@/components/BackButton";
import {Text, View} from "react-native";

export default function CharactersList() {

  return(
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2151', '#0a0f2d']}
        style={styles.background}
      />
      <BackButton />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Characters List</Text>
      <UserCharacters/>
      </View>
    </View>
    )
}