import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import Navbar from "../Components/Navbar";
import { appFirebase, db } from "../credenciales";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";

const AddCourse = () => {
  const navigation = useNavigation();
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTeacherName, setSelectedTeacherName] = useState("");

  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");

  const [trackingSheet, setTrackingSheet] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [manualsFolder, setManualsFolder] = useState("");

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const teachersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setTeachers(teachersList);
      } catch (error) {
        console.error("Error al obtener los profesores: ", error);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchCareers = async () => {
      const careersCollection = collection(db, "careers");
      const careersSnapshot = await getDocs(careersCollection);
      const careersList = careersSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data()["name-carrer"], // Usamos 'name-carrer' como campo de carrera
      }));
      setCareers(careersList);
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      const sectionsCollection = collection(db, "sections");
      const sectionsSnapshot = await getDocs(sectionsCollection);
      const sectionsList = sectionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().section,
      }));
      setSections(sectionsList);
    };

    fetchSections();
  }, []);

  const handleTeacherSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedTeacher(selectedId);

    const teacher = teachers.find((teacher) => teacher.id === selectedId);
    if (teacher) {
      setSelectedTeacherName(teacher.name);
    }
  };

  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (
      !courseTitle ||
      !selectedTeacher ||
      !selectedCareer ||
      !selectedSection ||
      !trackingSheet ||
      !driveLink ||
      !manualsFolder ||
      !description
    ) {
      alert("Todos los campos son obligatorios. Por favor, complétalos.");
      return;
    }
  
    const teacher = teachers.find((t) => t.id === selectedTeacher)?.name;
    const career = careers.find((c) => c.id === selectedCareer)?.name;
    const section = sections.find((c) => c.id === selectedSection)?.name;
    setLoading(true);
  
    try {
      const newCourse = {
        carrer: career,
        "name-course": courseTitle,
        "section-carrer": section,
        teacher: teacher,
        description: description,
        trackingSheet: trackingSheet,
        driveLink: driveLink,
        manualsFolder: manualsFolder,
      };
  
      // Guarda el curso en la colección "courses"
      await addDoc(collection(db, "courses"), newCourse);
      console.log("Curso agregado:", newCourse);
      setLoading(false);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error al agregar el curso:", error);
      setLoading(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
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
              placeholderTextColor="#8a8a8a"
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
                  value={teacher.id}
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
                { color: selectedCareer === "" ? "#8a8a8a" : "black" }, // Cambia el color según el valor seleccionado
              ]}
            >
              <Picker.Item label="Seleccione una carrera" value="" />
              {careers.map((career) => (
                <Picker.Item
                  key={career.id}
                  label={career.name}
                  value={career.id}
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
                { color: selectedSection === "" ? "#8a8a8a" : "black" }, // Cambia el color según el valor seleccionado
              ]}
            >
              <Picker.Item label="Seleccione una sección" value="" />
              {sections.map((section) => (
                <Picker.Item
                  key={section.id}
                  label={section.name}
                  value={section.id}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Planilla de seguimiento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el link de la planilla"
              placeholderTextColor="#8a8a8a"
              value={trackingSheet}
              onChangeText={setTrackingSheet}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Link de Drive</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el link de Drive"
              placeholderTextColor="#8a8a8a"
              value={driveLink}
              onChangeText={setDriveLink}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Carpeta de manuales</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el link de la carpeta de manuales"
              placeholderTextColor="#8a8a8a"
              value={manualsFolder}
              onChangeText={setManualsFolder}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción del Curso</Text>
            <TextInput
              style={styles.inputTextArea}
              placeholder="Descripción"
              placeholderTextColor="#8a8a8a"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View>
        <TouchableOpacity style={styles.addCourseButton} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addCourseButtonText}>Añadir Curso</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Icon name="x" size={20} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Curso añadido con éxito</Text>
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
  addCourseButton: {
    backgroundColor: "#8b2a30",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
  },
  addCourseButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    height: 60,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#000000",
    marginLeft: 5,
    marginBottom: 5, // Espaciado entre el label y el input
  },
  inputTextArea: {
    height: 150,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: "#c6c6c6",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: "top",
    fontSize: 16,
    paddingHorizontal: 16,
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
  scrollView: {
    marginBottom: 20,
  },
});

export default AddCourse;
