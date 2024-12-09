import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // Asegúrate de tener instalada la librería de iconos

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Menú inferior */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="home-outline" size={25} color="#000" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Cursos")}
        >
          <Icon name="school-outline" size={25} color="#000" />
          <Text style={styles.navText}>Cursos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="person-outline" size={25} color="#000" />
          <Text style={styles.navText}>Mi Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "space-between", 
    padding: 10,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 100,  
    height: 100, 
    resizeMode: "contain",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "#e8e8e8", 
    paddingTop: 10,
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    marginTop: 5,
    fontSize: 12,
    color: "#000",
  },
});

export default Navbar;
