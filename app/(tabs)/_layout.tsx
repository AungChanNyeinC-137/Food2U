import useAuthStore from '@/sotre/auth.store';
import { Redirect, Slot } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const {isAuthenticated} = useAuthStore();

 if(!isAuthenticated) return <Redirect href="/signIn"/>
  return (
   
   <Slot/> 
  )
}