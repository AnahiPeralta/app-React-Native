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
} from "react-native";
import { appFirebase, db } from "../credenciales";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Components/Navbar";
import TopNavbar from "../Components/TopNavbar";
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [searchText, setSearchText] = useState("");  // Almacena el texto de búsqueda
  const [courses, setCourses] = useState([]);  // Almacena los cursos
  const [filteredCourses, setFilteredCourses] = useState([]);  // Almacena los cursos filtrados
  const [loading, setLoading] = useState(true);  // Indica si los cursos están siendo cargados

  const navigation = useNavigation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
        setFilteredCourses(coursesData);  // Inicializa los cursos filtrados con todos los cursos
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtra los cursos según el texto de búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = courses.filter((course) =>
      course["name-course"].toLowerCase().includes(text.toLowerCase()) ||
      course["carrer"].toLowerCase().includes(text.toLowerCase()) ||
      course["teacher"].toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCourses(filtered);  // Actualiza los cursos filtrados
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.flexContent}>
      <View>
        <TopNavbar />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <View style={styles.maxWidth}>
            <View style={styles.bannerContainer}>
              <View style={styles.flexContainer}>
                <View style={styles.textContain}>
                  <Text style={styles.textDefault}>Bienvenido</Text>
                  <Text style={styles.textDefaultTwo}>
                    a la plataforma virtual
                  </Text>
                </View>
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../assets/logo_principal.png")}
                    style={styles.profile}
                  />
                </View>
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.containerText}>
                <Text style={styles.title}>Cursos Activos</Text>
                <Text style={styles.subtitle}>
                  Accede a los cursos disponibles
                </Text>
              </View>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar un curso..."
                  placeholderTextColor="#8a8a8a"
                  value={searchText}
                  onChangeText={handleSearch}  // Llama a handleSearch en cada cambio
                />
                <Icon
                  name="search"
                  size={18}
                  color="#000"
                  style={styles.searchIcon}
                />
              </View>
            </View>
            {filteredCourses.length > 0 ? (
              <View style={styles.gridContent}>
                <View style={styles.grid}>
                  {filteredCourses.map((course) => (
                    <View style={styles.cardsContent} key={course.id}>
                      <View style={styles.cardImage}>
                        <Image
                          source={require("../assets/portada-course.png")}
                          style={styles.imageCard}
                        />
                      </View>
                      <View style={styles.cardText}>
                        <Text style={styles.cardTarjet}>
                          {course["carrer"]}
                        </Text>
                        <Text style={styles.cardTitle}>
                          {course["name-course"]}
                        </Text>
                        <Text style={styles.cardTeacher}>
                          Profesor: {course["teacher"]}
                        </Text>
                      </View>
                      <View style={styles.cardButton}>
                        <TouchableOpacity style={styles.accessButton}
                          onPress={() => navigation.navigate('ViewMore')}>
                          <Text style={styles.accessText}>Acceder</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text>No hay cursos disponibles</Text>
            )}
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
  cardTarjet: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: "#008196",
    color: "white",
    fontSize: 12,
    width: 140,
    textAlign: "center",
    borderRadius: 5,
    marginBottom: 5,
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
    width: 80,
    height: 80,
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
});
