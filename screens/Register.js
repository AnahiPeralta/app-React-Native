import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
  ScrollView
} from "react-native";
import { appFirebase, db } from "../credenciales";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import * as Crypto from "expo-crypto";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Para el ícono de ojo

const auth = getAuth(appFirebase);

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Para mostrar/ocultar contraseña
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // Para mostrar/ocultar confirmación de contraseña

  const handleRegister = async () => {
    setLoading(true);

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let valid = true;

    // Validaciones
    if (!name) {
      setNameError("El nombre es obligatorio");
      valid = false;
    }

    if (!email) {
      setEmailError("El correo es obligatorio");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("*El correo no es válido");
      valid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      valid = false;
    }

    if (!valid) {
      setLoading(false);
      return; // Detener si las validaciones fallan
    }

    try {
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await addDoc(collection(db, "users"), {
        name: name,
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
      });

      console.log("Usuario registrado con éxito");
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
    navigation.navigate("Login");
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  const handlePasswordChange = (text) => {
    setPassword(text);

    const minLength = text.length >= 6;
    const hasUpperCase = /[A-Z]/.test(text);
    const hasNumber = /\d/.test(text);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(text);

    setPasswordStrength({
      minLength,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
    });
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
    >
<View style={styles.padre}>
      <View style={styles.imageContainer}>
        <Image source={require("../assets/logo_principal.png")} style={styles.profile} />
      </View>
      <Text style={styles.textTitle}>Registro de Usuario </Text>

      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      <View style={styles.tarjeta}>
        <TextInput
          placeholder="Ingresa tu nombre y apellido"
          placeholderTextColor="#8a8a8a"
          style={styles.inputStyle}
          value={name}
          onChangeText={setName}
        />
      </View>

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <View style={styles.tarjeta}>
        <TextInput
          placeholder="Ingresa tu correo electrónico"
          placeholderTextColor="#8a8a8a"
          style={styles.inputStyle}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      <View style={styles.tarjeta}>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#8a8a8a"
            style={[
              styles.inputStyle,
              !(passwordStrength.minLength && passwordStrength.hasUpperCase && passwordStrength.hasNumber && passwordStrength.hasSpecialChar) && styles.validInput
            ]}
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <MaterialCommunityIcons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
      {password && (
          <View style={styles.passwordErrors}>
            <Text style={passwordStrength.minLength ? styles.valid : styles.invalid}>* Mínimo 6 caracteres</Text>
            <Text style={passwordStrength.hasUpperCase ? styles.valid : styles.invalid}>* Al menos una mayúscula</Text>
            <Text style={passwordStrength.hasNumber ? styles.valid : styles.invalid}>* Al menos un número</Text>
            <Text style={passwordStrength.hasSpecialChar ? styles.valid : styles.invalid}>* Al menos un carácter especial</Text>
          </View>
      )}


      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
 
      <View style={styles.tarjeta}>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirma tu contraseña"
            placeholderTextColor="#8a8a8a"
            style={styles.inputStyle}
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          >
            <MaterialCommunityIcons
              name={isConfirmPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
      {confirmPassword && confirmPassword !== password && (
          <Text style={styles.passwordCriteria}>
            <Text style={styles.errorLabels}>Las contraseñas no coinciden</Text>
          </Text>
      )}

      <View style={styles.cardButton}>
        <TouchableOpacity onPress={handleRegister}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.textButton}>Regístrate</Text>}
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
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
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
    marginTop: 50,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  tarjeta: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    padding: 6,
    borderWidth: 1,
    borderColor: "#d5d5d5",
  },
  inputStyle: {
    paddingHorizontal: 10,
    fontSize: 14,
    outlineStyle: "none",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: 'left',
    width: '80%'
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  passwordCriteria: {
    fontSize: 13,
    marginBottom: 5,
    textAlign: 'left',
    width: '80%'
  },
  passwordErrors: {
    marginBottom: 5,
    textAlign: 'left',
    width: '80%'
  },
  valid: {
    color: "green",
  },
  invalid: {
    color: "gray",
  },
  errorLabels: {
    color: "red",
  },
  textTitle: {
    fontSize: 28,
    marginBottom: 20,
    marginTop: 15,
  },
  cardButton: {
    backgroundColor: "#8b2a30",
    borderRadius: 10,
    width: "80%",
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 5,
  },
  textButton: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  noAccountText: {
    color: "#111111",
    fontSize: 16,
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  registerButton: {
    borderRadius: 10,
    width: "80%",
    paddingTop: 15,
    paddingBottom: 15,
    borderWidth: 2,
    borderColor: "#8b2a30",
    marginBottom: 50,
  },
  registerText: {
    color: "#8b2a30",
    fontSize: 18,
    textAlign: "center",
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
    width: "80%",
  },

  scrollView: {
    width: "100%",
    alignSelf: "center",
    scrollbarWidth: "thin",
  }
});
