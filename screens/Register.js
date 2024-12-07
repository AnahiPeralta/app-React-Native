import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator
} from "react-native";
import {appFirebase, db} from "../credenciales";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { useNavigation } from '@react-navigation/native';

const auth = getAuth(appFirebase);

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigation = useNavigation();

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async () => {
    setLoading(true); 

    setNameError("");
    setEmailError("");
    setPasswordError("");

    let valid = true;

    // Validaciones
    if (!name) {
      setNameError("*El nombre es obligatorio");
      valid = false;
    }

    if (!email) {
      setEmailError("*El correo es obligatorio");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("*El correo no es válido");
      valid = false;
    }

    if (!password) {
      setPasswordError("*La contraseña es obligatoria");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      valid = false;
    }

    if (!valid) {
      setLoading(false);
      return; // Detener si las validaciones fallan
    }

    try {
      const salt = bcrypt.genSaltSync(10); 
      const hashedPassword = bcrypt.hashSync(password, salt);

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, "users"), {
        name: name,
        email: email,
        password: hashedPassword,
        createdAt: new Date(), 
      });
    
      console.log("Usuario registrado con exito");
      setLoading(false);
      setIsModalVisible(true);

    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setEmailError("El correo ya está registrado");
      } else {
        setEmailError("Ha ocurrido un error. Inténtalo de nuevo.");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigation.navigate("Login"); // Navega a la pantalla de Login
  };

  const goToLogin = () => {
    navigation.navigate("Login"); // Navega a la pantalla de registro
  };
  return (
    <View style={styles.padre}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/logo_principal.png")}
          style={styles.profile}
        />
      </View>
      <Text style={styles.textTitle}>Registro de Usuario </Text>

      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      <View style={styles.tarjeta}>
        <View>
          <TextInput
            placeholder="Ingresa tu nombre completo"
            placeholderTextColor="#8a8a8a"
            style={styles.inputStyle}
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <View style={styles.tarjeta}>
        <View>
          <TextInput
            placeholder="Ingresa tu correo electrónico"
            placeholderTextColor="#8a8a8a"
            style={styles.inputStyle}
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      <View style={styles.tarjeta}>
        <View>
          <TextInput
            placeholder="Ingresa tu contraseña "
            placeholderTextColor="#8a8a8a"
            style={styles.inputStyle}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <View style={styles.cardButton}>
        <TouchableOpacity onPress={handleRegister}>
          {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.textButton}>Regístrate</Text>
        )}
        </TouchableOpacity>
      </View>

      <Text style={styles.noAccountText}>¿Ya tienes una cuenta?</Text>
      <TouchableOpacity style={styles.registerButton} onPress={goToLogin}>
        <Text style={styles.registerText}>Inicia Sesión</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¡Bienvenido!</Text>
            <Text style={styles.modalMessage}>Te has registrado exitosamente.</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#8b2a30",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 20,
    textAlign: "left",
    width:"80%"
  }
});
