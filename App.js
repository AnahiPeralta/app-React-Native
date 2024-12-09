import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createAppContainer } from "react-navigation";
import { TransitionPresets } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import Cursos from "./screens/Cursos";
import AddCourse from "./screens/AddCourse";
import EditCourse from "./screens/EditCourse";
import Profile from "./screens/Profile";

const Stack = createStackNavigator();

const linking = {
  config: {
    screens: {
      Login: "",
      Register: "Register", // URL explícita para la pantalla de registro
      Home: "Home",
      Cursos: "Cursos",
      AddCourse: "Añadir",
      EditCourse: "Editar",
      Profile: "Perfil",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          animation: "fade",
          ...TransitionPresets.FadeFromBottomAndroid,
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cursos"
          component={Cursos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCourse"
          component={AddCourse}
          options={({ navigation }) => ({
            title: "Añadir Curso",
            headerStyle: {
              backgroundColor: "#800025",
            },
            headerTitleStyle: {
              color: "white",
              fontWeight: "400",
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Cursos")}>
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color="white"
                  style={{
                    marginRight: 5,
                    marginLeft: 20,
                  }}
                />
              </TouchableOpacity>
            ),
            headerBackVisible: false, // Desactiva el retroceso por defecto
          })}
        />
        <Stack.Screen 
          name="EditCourse" 
          component={EditCourse} 
          options={({ navigation }) => ({
            title: "Editar Curso",
            headerStyle: {
              backgroundColor: "#800025",
            },
            headerTitleStyle: {
              color: "white",
              fontWeight: "400",
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Cursos")}>
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color="white"
                  style={{
                    marginRight: 5,
                    marginLeft: 20,
                  }}
                />
              </TouchableOpacity>
            ),
            headerBackVisible: false, // Desactiva el retroceso por defecto
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
