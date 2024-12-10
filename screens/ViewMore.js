import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import { appFirebase, db } from "../credenciales";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Components/Navbar";
import TopNavbar from "../Components/TopNavbar";
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, getDocs } from "firebase/firestore";

export default function ViewMore() {
  const navigation = useNavigation();

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error(`No se puede abrir esta URL: ${url}`);
      }
    } catch (error) {
      console.error("Error al abrir el enlace:", error);
    }
  };

  return (
    <View style={styles.flexContent}>
      <View>
        <TopNavbar />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <View style={styles.maxWidth}>
            <View style={styles.cardCourse}>
              <Text style={styles.titleCarrer}>Probabilidad y Estadística</Text>
              <Text style={styles.titleProf}>Prof Yañez Cinthia</Text>
              <Image
                source={require("../assets/Logo-img.png")}
                style={styles.profile}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.titleResourses}>Descripción</Text>
              <View style={styles.description}>
                <Text style={styles.titleDescription}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </Text>
              </View>
              <Text style={styles.titleResourses}>Recursos</Text>
              <View style={styles.resourses}>
                {/* Enlace a la planilla de seguimiento */}
                <View style={styles.resourceItem}>
                  <Text style={styles.icon}>📋</Text>{" "}
                  {/* Ícono de la planilla */}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL(
                        "https://example.com/planilla-seguimiento"
                      )
                    }
                  >
                    Planilla de Seguimiento
                  </Text>
                </View>

                {/* Enlace al Drive */}
                <View style={styles.resourceItem}>
                  <Text style={styles.icon}>📂</Text> {/* Ícono de Drive */}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL("https://drive.google.com/example")
                    }
                  >
                    Link a Drive
                  </Text>
                </View>

                {/* Enlace a la carpeta de manuales */}
                <View style={styles.resourceItem}>
                  <Text style={styles.icon}>📚</Text> {/* Ícono de manuales */}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL("https://example.com/carpeta-manuales")
                    }
                  >
                    Carpeta de Manuales
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <Navbar />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  accessButton: {
    backgroundColor: "#8b2a30",
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 50,
    marginBottom: 10,
  },
  accessText: {
    color: "white",
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 18,
    color: "#800025",
    fontWeight: "600",
  },
  cardTeacher: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },

  cardsContent: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#c6c6c6",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "left",
  },

  cardImage: {
    width: "100%",
  },
  imageCard: {
    width: "100%",
    height: 100,
    borderTopEndRadius: 9,
    borderTopStartRadius: 9,
  },
  cardText: {
    width: "100%",
    padding: 10,
  },
  maxWidth: {
    width: "90%",
    alignSelf: "center",
  },
  bannerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  flexContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#800025",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  textContain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  imageContainer: {
    backgroundColor: "#fff",
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
    borderRadius: 100,
  },
  profile: {
    width: 120,
    height: 120,
    borderRadius: 50,
  },
  textDefault: {
    color: "white",
    fontSize: 28,
    fontWeight: "400",
  },
  textDefaultTwo: {
    color: "white",
    fontSize: 20,
    fontWeight: "300",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#555555",
  },
  subtitle: {
    fontSize: 16,
    color: "#8a8a8a",
    marginVertical: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#c6c6c6",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
    outlineStyle: "none",
  },
  searchIcon: {
    marginRight: 10,
    color: "#555555",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollView: {
    height: 560,
    overflow: "auto",
    width: "100%",
    alignSelf: "center",
    scrollbarWidth: "thin",
    scrollbarColor: "#c6c6c6 #e0e0e0",
  },

  resourses: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  titleResourses: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
    textAlign: "center",
    color: "#8b2a30",
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
    fontSize: 18, // Tamaño del ícono
  },
  link: {
    color: "#007BFF", // Color del enlace (azul)
    textDecorationLine: "underline",
    fontSize: 16,
  },
  cardCourse: {
    backgroundColor: "#517b84",
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  titleProf: {
    color: "#ffffff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "400",
    marginBottom: 10,
  },
  titleCarrer: {
    color: "#ffffff",
    fontSize: 26,
    textAlign: "center",
    fontWeight: "500",
  },
  titleDescription: {
    textAlign: 'justify'
  }
});
