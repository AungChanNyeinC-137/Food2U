import { appwriteConfig } from '@/lib/appwrite';
import { MenuItem } from '@/type';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity } from 'react-native';

const MenuCard = ({ item: { image_url, name, price } }: { item: MenuItem }) => { //destructure twice as Menuitem
  const img_url = `${image_url}${image_url.includes('?') ? '&' : '?'}project=${appwriteConfig.projectId}`;
  return (
    <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? {elevation: 10, shadowColor:'#878787'}:{}}>
      <Image
        source={{ uri: img_url }}
        onError={(e) => console.warn('❌ Image load error', e.nativeEvent.error)}
        className='size-32 absolute -top-10'
        resizeMode='contain'
      />
      <Text className='text-center base-bold text-dark-100' numberOfLines={1}>{name}</Text>
      <Text className='body-regular text-gray-200 mb-4'>From {price}Ks</Text>
      <TouchableOpacity onPress={() => {}}>
          <Text className='paragraph-bold text-primary'>Add to cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MenuCard