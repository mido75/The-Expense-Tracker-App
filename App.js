import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AllExpenses from './Screens/AllExpenses';
import RecentExpenses from './Screens/RecentExpenses';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageExpenses from './Screens/ManageExpense';
import { GlobalStyles } from './constants/styles';
import { Ionicons } from '@expo/vector-icons';
import IconButton from './components/UI/IconButton';
import ExpensesContextProvider from './store/ExpensesContext';

export default function App() {
  const BottomTab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function ExpensesOverview(){
    return (
      <BottomTab.Navigator screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: GlobalStyles.colors.primary500,
        },
        headerTintColor: 'white',
        tabBarStyle: {backgroundColor: GlobalStyles.colors.primary500},
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate('ManageExpenses');
            }}
            />),
      })}>
        <BottomTab.Screen name="Recent" component={RecentExpenses} options={{
          title: 'Recent Expenses',
          tabBarLabel: 'Recent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}/>
        <BottomTab.Screen name="AllExpenses" component={AllExpenses} options={{
          title: 'All Expenses',
          tabBarLabel: 'All Expenses',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}/>
      </BottomTab.Navigator>
    );
  }
  return (
    <>
      <StatusBar style="auto" />
      <ExpensesContextProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: GlobalStyles.colors.primary500 },  headerTintColor: 'white',}}>
            <Stack.Screen name="ExpensesOverview" component={ExpensesOverview} options={{headerShown: false }} />
            <Stack.Screen name="ManageExpenses" component={ManageExpenses} options={{presentation: 'modal'}} />
          </Stack.Navigator>
        </NavigationContainer>
      </ExpensesContextProvider>
    </>
  );
}

const styles = StyleSheet.create({});

