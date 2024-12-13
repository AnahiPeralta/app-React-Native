import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Asegúrate de instalar @expo/vector-icons
import appFirebase from "../credenciales";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth(appFirebase);

export default function Login(props) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para manejar la visibilidad de la contraseña

  const handleLogin = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setGeneralError(""); // Resetear error general

    // Validación de email
    if (!email) {
      setEmailError("*El correo es obligatorio");
      valid = false;
    }

    // Validación de contraseña
    if (!password) {
      setPasswordError("*La contraseña es obligatoria");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      valid = false;
    }

    // Si las validaciones pasan, hacer login
    if (valid) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Redirigir al usuario a la pantalla principal después del login exitoso
          navigation.navigate("Home");
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            setGeneralError("El usuario no está registrado en el sistema.");
          } else if (error.code === "auth/wrong-password") {
            setGeneralError("Credenciales incorrectas.");
          } else {
            setGeneralError("Ha ocurrido un error. Inténtalo de nuevo.");
          }
        });
    }
  };

  return (
    <View style={styles.padre}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/logo_principal.png")}
          style={styles.profile}
        />
      </View>
      <Text style={styles.textTitle}>Iniciar Sesión</Text>
      {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      
      {/* Campo de correo */}
      <View style={styles.tarjeta}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          placeholder="Ingresa tu correo electrónico"
          placeholderTextColor="#8a8a8a"
          style={styles.inputStyle}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
      </View>

      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {/* Campo de contraseña */}
      <View style={styles.tarjeta}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#8a8a8a"
            style={styles.inputStyle}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={!showPassword} // Dependiendo de showPassword, ocultar o mostrar
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón de inicio de sesión */}
      <View style={styles.cardButton}>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.textButton}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.noAccountText}>¿No tienes una cuenta?</Text>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 20,
    textAlign: "left",
    width:"80%",
  },
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  imageContainer: {
    backgroundColor: "#fff",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
    borderRadius: 100,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  tarjeta: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#d5d5d5",
  },
  inputStyle: {
    paddingHorizontal: 10,
    fontSize: 14,
    outlineStyle: "none",
  },
  textTitle: {
    fontSize: 28,
    marginBottom: 30,
    marginTop: 15,
  },
  cardButton: {
    backgroundColor: "#8b2a30",
    borderRadius: 10,
    width: "80%",
    paddingTop: 15,
    paddingBottom: 15,
  },
  textButton: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  noAccountText: {
    color: "#111111",
    fontSize: 16,
    marginTop: 40,
    marginBottom: 15,
    textAlign: "center",
  },
  registerButton: {
    borderRadius: 10,
    width: "80%",
    paddingTop: 15,
    paddingBottom: 15,
    borderWidth: 2,
    borderColor: "#8b2a30",
  },
  registerText: {
    color: "#8b2a30",
    fontSize: 18,
    textAlign: "center",
  },
  errorText: {
    marginBottom: 10,
    color: "red",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
});
