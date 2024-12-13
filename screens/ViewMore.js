import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import { db } from "../credenciales";
import { doc, getDoc } from "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";
import Navbar from "../Components/Navbar";
import TopNavbar from "../Components/TopNavbar";

export default function ViewMore() {
  const route = useRoute();
  const { courseId } = route.params || {}; // Verifica que courseId exista

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        console.error("No se proporcionó courseId.");
        setLoading(false);
        return;
      }

      try {
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (courseDoc.exists()) {
          setCourseData({ id: courseDoc.id, ...courseDoc.data() });
        } else {
          console.error("El curso no existe en Firestore.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const ensureValidUrl = (url) => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`; // Añadir 'https://' si no está presente
    }
    return url;
  };

  const handleLinkPress = async (url) => {
    if (!url) {
      console.warn("URL no válida.");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        console.log(`Abriendo URL: ${url}`);
        await Linking.openURL(url);
      } else {
        console.error(`No se puede abrir esta URL: ${url}`);
        alert("Esta URL no es compatible.");
      }
    } catch (error) {
      console.error("Error al abrir el enlace:", error);
      alert("Hubo un problema al intentar abrir el enlace.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!courseData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se encontró la información del curso.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.flexContent}>
      <TopNavbar />
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        <View style={styles.maxWidth}>
          <View style={styles.cardCourse}>
            <Text style={styles.titleCarrer}>{courseData["name-course"] || "Nombre no disponible"}</Text>
            <Text style={styles.titleProf}>Prof. {courseData["teacher"] || "No especificado"}</Text>
            <Image
              source={require("../assets/Logo-img.png")}
              style={styles.profile}
            />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.titleResourses}>Descripción</Text>
            <View style={styles.description}>
              <Text style={styles.titleDescription}>
                {courseData["description"] || "No hay descripción disponible."}
              </Text>
            </View>
            <Text style={styles.titleResourses}>Recursos</Text>
            <View style={styles.resourses}>
              {/* Planilla de seguimiento */}
              {courseData["trackingSheet"] ? (
                <View style={styles.resourceItem}>
                  <Text style={styles.icon}>📋</Text>
                  <Text
                    style={styles.link}
                    onPress={() => handleLinkPress(ensureValidUrl(courseData["trackingSheet"]))}
                  >
                    Planilla de Seguimiento
                  </Text>
                </View>
              ) : (
                <Text style={styles.noResourceText}>No hay planilla disponible</Text>
              )}

              {/* Enlace al Drive */}
              {courseData["driveLink"] ? (
                <View style={styles.resourceItem}>
                  <Text style={styles.icon}>📂</Text>
                  <Text
                    style={styles.link}
                    onPress={() => handleLinkPress(ensureValidUrl(courseData["driveLink"]))}
                  >
                    Link a Drive
                  </Text>
                </View>
              ) : (
                <Text style={styles.noResourceText}>No hay enlace a Drive</Text>
              )}

              {/* Carpeta de manuales */}
              {courseData["manualsFolder"] ? (
                <View style={styles.resourceItem}>
                  <Text style={styles.icon}>📚</Text>
                  <Text
                    style={styles.link}
                    onPress={() => handleLinkPress(ensureValidUrl(courseData["manualsFolder"]))}
                  >
                    Carpeta de Manuales
                  </Text>
                </View>
              ) : (
                <Text style={styles.noResourceText}>No hay carpeta de manuales</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Navbar />
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
