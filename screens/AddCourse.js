import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from "react-native";
import Navbar from "../Components/Navbar";
import { appFirebase, db } from "../credenciales";
import { collection, getDocs, addDoc  } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";


const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");


  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTeacherName, setSelectedTeacherName] = useState('');

  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');

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
      const careersCollection = collection(db, 'careers');
      const careersSnapshot = await getDocs(careersCollection);
      const careersList = careersSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data()['name-carrer'],  // Usamos 'name-carrer' como campo de carrera
      }));
      setCareers(careersList);
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      const sectionsCollection = collection(db, 'sections');
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
    const teacher = teachers.find(t => t.id === selectedTeacher)?.name;
    const career = careers.find(c => c.id === selectedCareer)?.name;
    const section = sections.find(c => c.id === selectedSection)?.name;
    setLoading(true); 
    try {
      const newCourse = {
        "carrer": career,
        "name-course": courseTitle,
        "section-carrer": section,
        teacher: teacher,
        description: description
      };

      // Guarda el curso en la colección "courses"
      await addDoc(collection(db, "courses"), newCourse);
      console.log("Curso agregado:", newCourse);
      setLoading(false);
      setIsModalVisible(true);

    } catch (error) {
      console.error("Error al agregar el curso:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigation.navigate("Cursos"); 
  };

  return (
    <View style={styles.container}>
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
        <select
          id="teacherSelect"
          value={selectedTeacher}
          onChange={handleTeacherSelect}
          style={styles.inputSelect}

        >
          <option value="" disabled style={{color: '#8a8a8a', fontWeight: '200',}}>Seleccione un profesor</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Carrera</Text>
        <select
          value={selectedCareer}
          onChange={(e) => setSelectedCareer(e.target.value)}
          style={styles.inputSelect}
        >
          <option 
            value="" 
            disabled 
            style={{
              color: '#8a8a8a', 
              fontWeight: '200',
            }}
          >
            Seleccione una carrera
          </option>
          {careers.map((career) => (
            <option key={career.id} value={career.id}>
              {career.name}
            </option>
          ))}
        </select>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sección</Text>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)} 
          style={styles.inputSelect} 
      >
        <option 
          value="" 
          disabled
          style={{color: '#8a8a8a', fontWeight: '200',}}
        >
          Seleccione una sección
        </option>
        {sections.map((section) => (
          <option key={section.id} value={section.id}>
            {section.name}
          </option>
        ))}
      </select>
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

      <View>
        <TouchableOpacity
          style={styles.addCourseButton}
          onPress={handleSubmit}
        >
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
            <Text style={styles.modalTitle}>Curso añadido con éxito</Text>
            <Text style={styles.modalMessage}>Ahora puedes verlo en Cursos</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
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
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#8a8a8a",
    marginLeft: 5,
    marginBottom: 5, // Espaciado entre el label y el input
  },
  inputTextArea: {
    height: 150,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#c6c6c6",
    backgroundColor: "white",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    fontSize: '13px',
    boxSizing: "border-box",
    color: '#8a8a8a'
  },
});

export default AddCourse;
