import React, { useState, useEffect ,Fragment} from 'react';
import { View, Text, StyleSheet, Image, ScrollView,TouchableOpacity,BackHandler} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getClasses, getSections } from '../services/class.services';
import { getAllStudents } from '../services/student.services';
import  Icon  from 'react-native-vector-icons/FontAwesome';

const StudentList = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [studentsData, setStudentsData] = useState(null);

  useEffect(() => {
    getClassList();
      const handleBackPress = () => {
          navigation.goBack();
          return true;
      };
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
  }, []);

  useEffect(() => {
    if (selectedClass) {
      getSectionList(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedSection) {
      getStudentsData(selectedClass, selectedSection);
    }
  }, [selectedSection]);

  const getClassList = () => {
    getClasses()
      .then((res) => {
        setClassList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSectionList = (selectedClass) => {
    getSections(selectedClass)
      .then((res) => {
        setSectionList(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStudentsData = (selectedClass, selectedSection) => {
    let data = {
      totalStudents: 0,
      maleStudents: 0,
      femaleStudents: 0,
      studentList: [],
    };
    getAllStudents(selectedClass, selectedSection)
      .then((res) => {
        data.totalStudents = res.length;
        data.studentList = res;
        for (let i = 0; i < res.length; i++) {
          if (res[i].gender.toLowerCase() === 'male') {
            data.maleStudents++;
          }
          if (res[i].gender.toLowerCase() === 'female') {
            data.femaleStudents++;
          }
        }
        if (data.femaleStudents + data.maleStudents === 2 * res.length) {
          data.maleStudents /= 2;
          data.femaleStudents /= 2;
        }
        setStudentsData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigateToStudentProfile = (item) => {
    navigation.navigate('Student Profile', { student: item });
  };

  const renderStudentItem = ( item, index ) => {
    return (
      <TouchableOpacity
        style={styles.studentItemContainer}
        onPress={() => navigateToStudentProfile(item)}
      >
        <View style={styles.imageContainer}>
          {item.userimage ? (
            <Image style={styles.studentImage} source={{ uri: item.userimage }} />
          ) : (
            <Image source={require('../assets/user1.jpg')} style={styles.studentImage} />
          )}
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.fullname}</Text>
          <Text style={styles.studentName}>Admission Number: {item.admissionnumber}</Text>
          <Text style={styles.studentName}>Gender: {item.gender}</Text>
        </View>
        <TouchableOpacity onPress={() => navigateToStudentProfile(item)}>
          <Icon name="angle-right" size={24} color="#233698" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSeparator = (index ) => (
    index !== studentsData.studentList.length - 1 && <View style={styles.separator} />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.cardHeading}>Class:</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedClass}
              style={styles.dropdown} dropdownIconColor='gray' dropdownRippleColor='gray'
              onValueChange={(itemValue) => setSelectedClass(itemValue)}
            >
              <Picker.Item label="Select Class" value="" />
              {classList.map((classItem) => (
                <Picker.Item
                  label={classItem.displayname}
                  value={classItem.id}
                  key={classItem.id}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardHeading}>Section:</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedSection}
              style={styles.dropdown} dropdownIconColor='gray' dropdownRippleColor='gray'
              onValueChange={(itemValue) => setSelectedSection(itemValue)}
            >
              <Picker.Item label="Select Section" value="" />
              {sectionList.map((section) => (
                <Picker.Item
                  label={section.displayname}
                  value={section.id}
                  key={section.id}
                />
              ))}
            </Picker>
          </View>
        </View>
        {studentsData && (
          <View style={styles.statsContainer}>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Total: {studentsData.totalStudents}</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Male: {studentsData.maleStudents}</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Female: {studentsData.femaleStudents}</Text>
            </View>
          </View>
        )}
      </View>
      {studentsData && (
        <View style={styles.card}>
          {studentsData.studentList.map((item, index) => (
              <Fragment key={index}>
                {index !== 0 && renderSeparator()}
                {renderStudentItem(item, index)}
              </Fragment>
            ))
          }
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
    color:"gray"
  },
  dropdownContainer: {
    flex: 1,
    marginLeft: 10,
  },
  dropdown: {
    height: 40,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    color:'gray'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  statsLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 5,
    color:"gray"
  },
  studentItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  imageContainer: {
    marginRight: 10,
    borderWidth: 4,
    borderColor: '#233698',
    borderRadius: 50,
  },
  studentImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 40,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color:"gray"
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginLeft: 50,
  },
});

export default StudentList;
