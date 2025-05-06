
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import  COLORS  from '../constants/colors';

const SafeScreen = ({children}) => {

    const insets = useSafeAreaInsets();

  return (
    <View style={[styles.contaier, {paddingTop: insets.top}]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
    contaier: {
        flex: 1,
        backgroundColor: COLORS.background
    }
})

export default SafeScreen