import React, { useState, useEffect } from "react";
import { appFirebase, db } from "../credenciales";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import Navbar from "../Components/Navbar";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import TopNavbar from "../Components/TopNavbar";
import { Button } from "react-native-web";
import AddCourse from "./AddCourse";
export default function Cursos() {
  const [searchText, setSearchText] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // Estado para los cursos filtrados
  const [showModal, setShowModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setFilteredCourses(coursesData); // Inicializa los cursos filtrados
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Filtrar los cursos en base al texto de búsqueda
    if (searchText.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const lowerSearchText = searchText.toLowerCase();
      setFilteredCourses(
        courses.filter(
          (course) =>
            course["name-course"].toLowerCase().includes(lowerSearchText) ||
            course["teacher"].toLowerCase().includes(lowerSearchText) ||
            course["carrer"].toLowerCase().includes(lowerSearchText)
        )
      );
    }
  }, [searchText, courses]);

  const deleteCourse = async (id) => {
    try {
      const courseDoc = doc(db, "courses", id);
      await deleteDoc(courseDoc);
      setCourses(courses.filter((course) => course.id !== id));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEdit = (id) => {
    navigation.navigate("EditCourse", { courseId: id });
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
      <TopNavbar />
      {/* Búsqueda */}
      <View style={styles.bannerContainer}>
        <View style={styles.containerSearch}>
          <View style={styles.textContain}>
            <Text style={styles.textDefault}>Listado de Cursos</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar un curso..."
              placeholderTextColor="#8a8a8a"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
            <Icon
              name="search"
              size={18}
              color="#000"
              style={styles.searchIcon}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addCourseButton}
        onPress={() => navigation.navigate("AddCourse")}
      >
        <Text style={styles.addCourseText}>AddCourse</Text>
      </TouchableOpacity>
      {/* Cursos */}
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        <View style={styles.maxWidth}>
          <View style={styles.containerCursos}>
            <View style={styles.cardsContainer}>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <View style={styles.card} key={course.id}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.cardTarjet}>{course["carrer"]}</Text>
                      <Text style={styles.cardTitle}>{course["name-course"]}</Text>
                      <Text style={styles.cardTeacher}>
                        Profesor: {course["teacher"]}
                      </Text>
                    </View>
                    <View style={styles.cardRight}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEdit(course.id)}
                      >
                        <Icon name="edit" size={18} color="#fff" style={styles.icon} />
                        <Text style={styles.editText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          setCourseToDelete(course.id);
                          setShowModal(true);
                        }}
                      >
                        <Icon name="trash" size={18} color="#fff" style={styles.icon} />
                        <Text style={styles.deleteText}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No hay cursos disponibles</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar este curso?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => deleteCourse(courseToDelete)}
              >
                <Text style={styles.confirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Navbar />
    </View>
  );
}


const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    // flex: 1,
    justifyContent: "center",
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 25,
  },
  logo: {
    width: "100%",
    height: 60,
    resizeMode: "contain",
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
  modalContent: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 10,
    alignItems: "center",
    width: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  modalMessage: {
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: "#800025",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  modalButtonCancel: {
    backgroundColor: "#555555",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  modalButtonText: {
    color: "#fff",
  },

  scrollView: {
    // height: 330,
    height: 370,
    overflow: "auto",
    width: "90%",
    alignSelf: "center",
    scrollbarWidth: "thin",
    scrollbarColor: "#c6c6c6 #e0e0e0",
  },

  maxWidth: {
    width: "100%",
    alignSelf: "center",
  },

  bannerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  containerSearch: {
    width: "100%",
    backgroundColor: "#800025",
    borderEndEndRadius: 15,
    borderBottomLeftRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },

  textDefault: {
    color: "white",
    fontSize: 20,
    fontWeight: "400",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
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

  containerCursos: {
    marginTop: 5,
  },
  addCourseButtonContainer: {
    alignItems: "flex-end", // Alinea el botón a la derecha
    marginRight: 30,
  },
  addCourseButton: {
    backgroundColor: "#8b2a30",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  addCourseButtonText: {
    color: "white",
    fontSize: 16,
  },
  cardsContainer: {
    marginTop: 10,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c6c6c6",
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardTitle: {
    fontSize: 18,
    color: "#800025",
    fontWeight: "600",
  },
  cardTeacher: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#555555",
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
    gap: 5,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#800025",
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: "center",
    borderRadius: 5,
    gap: 5,
  },
  editText: {
    color: "white",
    fontSize: 14,
  },
  deleteText: {
    color: "white",
    fontSize: 14,
  },
  cardTarjet: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: "#008196",
    color: "white",
    fontSize: 13,
    width: 170,
    textAlign: "center",
    borderRadius: 5,
    marginBottom: 5,
  },
});
