import { LogOut } from '@/lib/appwrite'
import { router } from 'expo-router'
import React from 'react'
import { Button, View } from 'react-native'

const profile = () => {
  const logout = async () => {
    await LogOut();
    router.replace('/signIn');

  }
  return (
    <View>
      <Button title='logout' onPress={() => logout} />
    </View>
  )
}

export default profile