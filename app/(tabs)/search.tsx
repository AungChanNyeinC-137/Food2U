import { getCategories, getMenu } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const search = () => {
      const { category, query } = useLocalSearchParams<{query: string; category: string}>()

    const { data, refetch, loading } = useAppwrite({ fn: getMenu, params: { category,  query,  limit: 6, } });
    console.log('data: Menu: ',data)
    const { data: categories } = useAppwrite({ fn: getCategories });

    useEffect(() => {
        refetch({ category, query, limit: 6})
    }, [category, query]);


  return (
    <SafeAreaView className='bg-white-'>
      Search
    </SafeAreaView>
  )
}

export default search