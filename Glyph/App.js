import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NoteList from './src/screens/NoteList';
import NoteEdit from './src/screens/NoteEdit';
import NoteDetail from './src/screens/NoteDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen
            name="NoteList"
            component={NoteList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NoteEdit"
            component={NoteEdit}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NoteDetail"
            component={NoteDetail}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}