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
import appFirebase from "../credenciales";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth(appFirebase);

export default function Login(props) {
  const navigation = useNavigation();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

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
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          // Redirigir al usuario a la pantalla principal después del login exitoso
          navigation.navigate("Home"); // Asegúrate de tener configurada esta pantalla en tu navegación
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
      {generalError ? (
        <Text style={styles.errorText}>{generalError}</Text>
      ) : null}
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      <View style={styles.tarjeta}>
        <View>
          <TextInput
            placeholder="Ingresa tu correo electrónico"
            placeholderTextColor="#8a8a8a"
            style={styles.inputStyle}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>

      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      <View style={styles.tarjeta}>
        <View>
          <TextInput
            placeholder="Ingresa tu contraseña "
            placeholderTextColor="#8a8a8a"
            style={styles.inputStyle}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
      </View>

      <View style={styles.cardButton}>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.textButton}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.noAccountText}>¿No tienes una cuenta?</Text>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
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
    width:"80%"
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
    borderRadius: "10px",
    width: "80%",
    padding: 15,
    border: "1px solid #d5d5d5",
  },
  inputStyle: {
    paddingHorizontal: 10,
    fontSize: "14px",
    outlineStyle: "none",
  },
  inputPass: {
    paddingHorizontal: 10,
    fontSize: "14px",
    outlineStyle: "none",
    flex: 1,
  },
  iconContainer: {
    padding: 10,
  },
  textTitle: {
    fontSize: "28px",
    marginBottom: "30px",
    marginTop: "15px",
  },
  cardButton: {
    backgroundColor: "#8b2a30",
    borderRadius: "10px",
    width: "80%",
    paddingTop: "15px",
    paddingBottom: "15px",
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
    backgroundColor: "",
    borderRadius: "10px",
    width: "80%",
    paddingTop: "15px",
    paddingBottom: "15px",
    border: "2px solid #8b2a30",
  },
  registerText: {
    color: "#8b2a30",
    fontSize: 18,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row", // Para alinear el input y el icono horizontalmente
    alignItems: "center",
  },
  errorText: {
    marginBottom: 10,
  }
});
