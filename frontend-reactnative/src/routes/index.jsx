import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostIndex from '../screens/posts/Index';
import PostCreate from '../screens/posts/Create';
import PostEdit from '../screens/posts/Edit';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e3a8a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="PostIndex"
        component={PostIndex}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostCreate"
        component={PostCreate}
        options={{ title: 'Jual Barang Thrift' }}
      />
      <Stack.Screen
        name="PostEdit"
        component={PostEdit}
        options={{ title: 'Edit Barang Thrift' }}
      />
    </Stack.Navigator>
  );
}
