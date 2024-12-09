import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth"; // Importar la función de Firebase
import { appFirebase } from "../credenciales"; // Asegúrate de importar tu configuración de Firebase
import Navbar from "../Components/Navbar";
import TopNavbar from "../Components/TopNavbar";

const Profile = ({ navigation }) => {
  // Función para cerrar sesión
  const handleLogout = () => {
    const auth = getAuth(appFirebase);

    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión: ", error);
      });
  };

  return (
    <View>
      <TopNavbar />
      <View style={styles.container}>
        <Text style={styles.title}>Perfil de Usuario</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </View>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 240,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#800025",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Profile;
