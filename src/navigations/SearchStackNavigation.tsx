import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Search from '../screens/Search'
import CategorySearchResult from '../components/search/CategorySearchResult'
import MovieDetail from '../screens/MovieDetail'

const Stack = createNativeStackNavigator()

export default function HomeStackNavigation(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="CategorySearchResult" 
        component={CategorySearchResult} 
      />
      <Stack.Screen 
        name="MovieDetail" 
        component={MovieDetail} 
        options={{ title: 'Movie Details' }} 
      />
    </Stack.Navigator>
  )
}