import seed from '@/lib/seed'
import React from 'react'
import { Button, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const search = () => {
  return (
    <SafeAreaView>
      <Text> Search</Text>
      <Button title='Seed' onPress={()=> seed().catch((err)=>console.log('Failed to seed the database.',err))}></Button>
    </SafeAreaView>
  )
}

export default search