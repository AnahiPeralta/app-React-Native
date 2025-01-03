import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView
} from "react-native";
import Navbar from "../Components/Navbar";
import { db } from "../credenciales";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const EditCourse = ({ route, navigation }) => {
  const { courseId } = route.params; // Suponemos que el ID del curso se pasa como parámetro

  // Estados para los datos del curso y las listas
  const [courseTitle, setCourseTitle] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [description, setDescription] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [careers, setCareers] = useState([]);
  const [sections, setSections] = useState([]);

  const [trackingSheet, setTrackingSheet] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [manualsFolder, setManualsFolder] = useState("");


  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Obtener los datos del curso a editar
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const docRef = doc(db, "courses", courseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCourseTitle(data["name-course"]);
          setSelectedTeacher(data["teacher"]);
          setSelectedCareer(data["carrer"]);
          setSelectedSection(data["section-carrer"]);
          setDescription(data["description"]);
          setTrackingSheet(data["trackingSheet"] || "");
          setDriveLink(data["driveLink"] || "");
          setManualsFolder(data["manualsFolder"] || "");

        } else {
          console.log("El curso no existe.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Obtener la lista de profesores, carreras y secciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersSnapshot = await getDocs(collection(db, "teachers"));
        const careersSnapshot = await getDocs(collection(db, "careers"));
        const sectionsSnapshot = await getDocs(collection(db, "sections"));

        setTeachers(
          teachersSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }))
        );

        setCareers(
          careersSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data()["name-carrer"],
          }))
        );

        setSections(
          sectionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().section,
          }))
        );
      } catch (error) {
        console.error("Error al obtener listas:", error);
      }
    };

    fetchData();
  }, []);

  // Función para manejar la actualización del curso
  const handleUpdateCourse = async () => {
    if (
      !courseTitle ||
      !selectedTeacher ||
      !selectedCareer ||
      !selectedSection ||
      !description ||
      !trackingSheet ||
      !driveLink ||
      !manualsFolder
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, {
        "name-course": courseTitle,
        teacher: selectedTeacher,
        carrer: selectedCareer,
        "section-carrer": selectedSection,
        description: description,
        trackingSheet: trackingSheet,
        driveLink: driveLink,
        manualsFolder: manualsFolder,
      });

      setModalMessage("Curso actualizado correctamente.");
      setModalVisible(true);
    } catch (error) {
      console.error("Error al actualizar el curso:", error);
      setModalMessage("Hubo un error al actualizar el curso.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar spinner mientras se cargan los datos
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate("Cursos");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.containerInputs}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de curso</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el nombre del curso"
              value={courseTitle}
              onChangeText={setCourseTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Profesor Asignado</Text>
            <Picker
              selectedValue={selectedTeacher}
              onValueChange={(itemValue) => setSelectedTeacher(itemValue)}
              style={[
                styles.inputSelectCustom,
                { color: selectedTeacher === "" ? "#8a8a8a" : "black" },
              ]}
            >
              <Picker.Item label="Seleccione un profesor" value="" />
              {teachers.map((teacher) => (
                <Picker.Item
                  key={teacher.id}
                  label={teacher.name}
                  value={teacher.name}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Carrera</Text>
            <Picker
              selectedValue={selectedCareer}
              onValueChange={(itemValue) => setSelectedCareer(itemValue)}
              style={[
                styles.inputSelectCustom,
                { color: selectedCareer === "" ? "#8a8a8a" : "black" },
              ]}
            >
              <Picker.Item label="Seleccione una carrera" value="" />
              {careers.map((career) => (
                <Picker.Item
                  key={career.id}
                  label={career.name}
                  value={career.name}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sección</Text>
            <Picker
              selectedValue={selectedSection}
              onValueChange={(itemValue) => setSelectedSection(itemValue)}
              style={[
                styles.inputSelectCustom,
                { color: selectedSection === "" ? "#8a8a8a" : "black" },
              ]}
            >
              <Picker.Item label="Seleccione una sección" value="" />
              {sections.map((section) => (
                <Picker.Item
                  key={section.id}
                  label={section.name}
                  value={section.name}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Planilla de seguimiento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la hoja de seguimiento"
              value={trackingSheet}
              onChangeText={setTrackingSheet}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enlace a Google Drive</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el enlace a Google Drive"
              value={driveLink}
              onChangeText={setDriveLink}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Carpeta de manuales</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la carpeta de manuales"
              value={manualsFolder}
              onChangeText={setManualsFolder}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.inputTextArea}
              placeholder="Ingrese la descripción del curso"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.editCourseButton}
        onPress={handleUpdateCourse}
      >
        <Text style={styles.editCourseButtonText}>Actualizar Curso</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Icon name="x" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Cambios Guardados</Text>
            <Text style={styles.modalMessage}>
              Ahora puedes verlo en Cursos
            </Text>
          </View>
        </View>
      </Modal>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: "#000000",
    marginLeft: 5,
    marginBottom: 5, // Espaciado entre el label y el input
  },
  input: {
    height: 60,
    fontSize: 16,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputTextArea: {
    height: 150,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  inputSelect: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 10,
    fontSize: 13,
    boxSizing: "border-box",
    color: "#8a8a8a",
  },

  inputSelectCustom: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 13,
    boxSizing: "border-box",
    color: "#8a8a8a",
  },

  editCourseButton: {
    backgroundColor: "#8b2a30",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
  },
  editCourseButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
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
    marginBottom: 5,
    marginTop: 20
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    position: "absolute", 
    top: 20,
    right: 20,
    zIndex: 10,
  },
  modalButtonText: {
    color: "#000000",
    fontSize: 16,
  },

  inputSelectCustom: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginBottom: 15,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 13,
    boxSizing: "border-box",
    color: "#8a8a8a",
  },
  scrollView: {
    marginBottom: 20,
  },
});

export default EditCourse;
