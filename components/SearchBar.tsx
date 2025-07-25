import { images } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>()
  const [query, setQuery] = useState(params.query);
  const debounceSearch = useDebouncedCallback(
    (text) => router.push(`/search?query=${text}`),
    500
  )
  const handleSearch = (text: string) => {
    setQuery(text);
    debounceSearch(text);
  }

  return (
    <View className='searchbar'>
      <TextInput className='flex-1 p-5'
        placeholder='Search for burgers, pizzas,...'
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor='#a0a0a0'
      />
      <TouchableOpacity className='pr-5' onPress={() => { router.push(`/search?query=${query}`) }}>
        <Image source={images.search} className='size-6' resizeMode='contain' tintColor='5D5F6D' />
      </TouchableOpacity>
    </View>
  )
}

export default SearchBar