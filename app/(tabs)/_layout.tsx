import { images } from '@/constants';
import useAuthStore from '@/sotre/auth.store';
import { TabBarIconProps } from '@/type';
import cn from 'clsx';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const TabBarIcon = ({focused, icon, title}:TabBarIconProps) => (
  <View className='tab-icon'>
    <Image source={icon} className='size-7' resizeMode='contain' tintColor={focused?'#fe8c00':'#5d5f6d'}/>
    <Text className={cn('text-sm font-bold', focused? 'text-primary': 'text-primary' )}>
      {title}
    </Text>

  </View>
)

export default function TabLayout() {
  const {isAuthenticated} = useAuthStore();

 if(!isAuthenticated) return <Redirect href="/signIn"/>
  return (
   
   <Tabs
    screenOptions={{
      headerShown:false, 
      tabBarShowLabel:false,
       tabBarStyle:{
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        marginHorizontal:20,
        height: 80,
        position: 'absolute',
        bottom: 40,
        backgroundColor: 'white',
        shadowColor:'#1a1a1a',
       shadowOffset:{width: 0, height: 2},
       shadowOpacity: 0.1,
       shadowRadius:5, 
       elevation:5,

   }}}  >
      <Tabs.Screen 
      name='index'
      options={{
        title:'Home',
        tabBarIcon:({focused})=><TabBarIcon title="Home" icon={images.home} focused={focused} />
      }}
      />
      <Tabs.Screen 
      name='search'
      options={{
        title:'Search',
        tabBarIcon:({focused})=><TabBarIcon title="Search" icon={images.search} focused={focused} />
      }}
      />
      <Tabs.Screen 
      name='cart'
      options={{
        title:'Cart',
        tabBarIcon:({focused})=><TabBarIcon title="Cart" icon={images.bag} focused={focused} />
      }}
      />
      <Tabs.Screen 
      name='profile'
      options={{
        title:'Profile',
        tabBarIcon:({focused})=><TabBarIcon title="Profile" icon={images.person} focused={focused} />
      }}
      />
   </Tabs>
  )
}