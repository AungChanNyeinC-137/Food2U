import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import useAuthStore from '@/sotre/auth.store'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const signUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { name, email, password } = form;
  const {fetchAuthenticatedUser} = useAuthStore();
  const submit = async () => {
    if (!name || !email || !password) { Alert.alert('Error', 'Please enter valid email address & password'); return; }
    setIsSubmitting(true);
    try {
      await createUser({ name, email, password, })
      await fetchAuthenticatedUser();
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
      <CustomInput
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(text) => { setForm((prev) => ({ ...prev, name: text })) }}
        label="Full Name"
      />
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => { setForm((prev) => ({ ...prev, email: text })) }}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => { setForm((prev) => ({ ...prev, password: text })) }}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton
        title='Sign Up'
        isLoading={isSubmitting}
        onPress={submit}
      />
      <View className='flex justify-center mt-5 flex-row gap-2'>
        <Text className='base-regular text-gray-100'>
          Already have an account?
        </Text>
        <Link href='/signIn' className='base-bold text-primary'>
          Sign In</Link>
      </View>
    </View>
  )
}

export default signUp