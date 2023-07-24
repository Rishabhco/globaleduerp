import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllClassesAndSections, getExamsData, getStudentsData, getStudentGrade, saveMarks} from '../services/exam.services';

const ExaminationMarks = ({navigation}) => {
    const [classSectionData, setClassSectionData] = useState([]);

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedExam, setSelectedExam] = useState('');

    const [classList, setClassList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [examList, setExamList] = useState([]);

    const [buttonVisible, setButtonVisible] = useState(false);
    const [saveButtonVisible, setSaveButtonVisible] = useState(false);

    const [stats, setStats] = useState({
        min: 0,
        max: 0,
        date: '',
    });

    const [studentsList, setStudentsList] = useState([]);
    
    useEffect(() => {
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
        getAllClassesAndSections().then((res) => {
            setClassSectionData(res);
            const uniqueClasses = [...new Map(res.map((item) => [item['classmaster_id'], item])).values(),];
            setClassList(uniqueClasses);
            setSelectedClass(res[0].classmaster_id);
        }).catch((err) => {
            console.log(err);
        });
    }, []);
    

    useEffect(() => {
        if (selectedClass) {
            handleClassSelection(selectedClass);
            setSaveButtonVisible(false);
        }
    }, [selectedClass])

    useEffect(() => {
        if (selectedClass) {
            handleSectionSelection(selectedSection);
            setSaveButtonVisible(false);
        }
    }, [selectedSection])

    useEffect(() => {
        if (selectedCourse) {
            handleCourseSelection(selectedCourse);
            setSaveButtonVisible(false);
        }
    }, [selectedCourse])

    const handleClassSelection = (classId) => {
        setSelectedClass(classId);
        let sectionMasterId;
        const sectionListData = classSectionData.filter(item => {
            if (item.classmaster_id == selectedClass && item.sectionmaster_id != sectionMasterId) {
                sectionMasterId = item.sectionmaster_id;
                return item;
            }
        });
        setSectionList(sectionListData);
        setSelectedSection(sectionListData[0].sectionmaster_id);
    };

    const handleSectionSelection = (sectionId) => {
        setSelectedSection(sectionId);
        let courseMasterId;
        const subjectsData = classSectionData.filter(item => {
            if (item.classmaster_id == selectedClass && item.sectionmaster_id == selectedSection && item.coursemaster_id != courseMasterId) {
                courseMasterId = item.coursemaster_id;
                return item;
            }
        });
        setCourseList(subjectsData);
        setSelectedCourse('');
        setSelectedExam('');
    };

    const handleCourseSelection = (courseId) => {
        setSelectedCourse(courseId);
        getExamsData(selectedClass, selectedSection, courseId).then((res) => {
            setExamList(res);
            setSelectedExam('');
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleExamSelection = (examId) => {
        setSelectedExam(examId);
        const res = examList.filter((item) => item.exam_id == examId);
        setStats({
            min: res[0].minmarks,
            max: res[0].maxmarks,
            date: res[0].examdate,
        });
        setButtonVisible(true);
    };

    const handleGetStudentList = () => {
        getStudentsData(selectedClass, selectedSection, selectedCourse, selectedExam).then((res) => {
            if (res[0].hasOwnProperty('errormessage')) {
                Alert.alert(res[0].errormessage);
            } else {
                let students = res;
                students.sort((a, b) => {
                    var textA = a.studentname.toUpperCase();
                    var textB = b.studentname.toUpperCase();
                    return (textA < textB) ? -1 : textA > textB ? 1 : 0;
                });
                setStudentsList(students);
                setButtonVisible(false);
                setSaveButtonVisible(true);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleMarksChange = (item, index, value) => {
        const updatedStudentsList = [...studentsList];
        updatedStudentsList[index].marks = value;
        setStudentsList(updatedStudentsList);
        const updatedMarks = parseInt(value);
        if(!isNaN(updatedMarks)) {
            if (updatedMarks < item.minmarks) {
                Alert.alert("Marks cannot be less than the minimum marks");
                updatedStudentsList[index].marks = '0';
                setStudentsList(updatedStudentsList);
            } else if (updatedMarks > item.maxmarks) {
                Alert.alert("Marks cannot be greater than the maximum marks");
                updatedStudentsList[index].marks = '0';
                setStudentsList(updatedStudentsList);
            } else {
                getStudentGrade(item.exam_id, selectedCourse, updatedMarks).then(res => {
                    const updatedStudentsLists = [...studentsList];
                    updatedStudentsLists[index].grade = res[0].grade;
                    setStudentsList(updatedStudentsLists);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };

    const handleSave = () => {
        saveMarks(studentsList).then(res => {
            Alert.alert('Student marks successfully updated.');
            saveButtonVisible(false);
            handleGetStudentList();
        }).catch(err => {
            console.log(err);
        });
    }

    const renderStudentItem = (item, index) => {
        return (
            <View style={styles.studentItemContainer}>
                <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>Admission Number: {item.admissionnumber}</Text>
                    <Text style={styles.studentName}>Name: {item.studentname}</Text>
                    <Text style={styles.studentName}>Father Name: {item.fathername}</Text>
                    <Text style={styles.studentName}>Roll No: {item.rollnumber == 0 ? 'N.A.' : item.rollnumber}</Text>
                </View>
                <View style={styles.studentMarks}>
                    <TextInput
                        style={styles.marksInput}
                        value={item.marks}
                        onChangeText={value => handleMarksChange(item, index, value)}
                        key={index.toString()}
                    />
                </View>
                <View style={styles.studentMarks}>
                    <Text style={styles.studentName}>{item.grade}</Text>
                </View>
            </View>
        );
    };


    const renderSeparator = (index) => (index !== studentsList.length - 1 && <View style={styles.separator} />);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Class</Text>
                        <Picker selectedValue={selectedClass} style={styles.dropdown} onValueChange={handleClassSelection} 
                            dropdownIconColor='gray' dropdownRippleColor='gray'
                        >
                            <Picker.Item label="Select Class" value="" />
                            {classList.map((classItem) => (
                                <Picker.Item label={classItem.class} value={classItem.classmaster_id} key={classItem.classmaster_id} />
                            ))}
                        </Picker>
                        <Text style={styles.label}>Section</Text>
                        <Picker selectedValue={selectedSection} style={styles.dropdown} onValueChange={handleSectionSelection}
                            dropdownIconColor='gray' dropdownRippleColor='gray'
                        >
                            <Picker.Item label="Select Section" value="" />
                            {sectionList.map((section) => (
                                <Picker.Item label={section.section} value={section.sectionmaster_id} key={section.sectionmaster_id} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Course</Text>
                        <Picker selectedValue={selectedCourse} style={styles.dropdown} onValueChange={handleCourseSelection} 
                            dropdownIconColor='gray' dropdownRippleColor='gray'
                        >
                            <Picker.Item label="Select Course" value="" />
                            {courseList.map((course) => (
                                <Picker.Item label={course.course} value={course.coursemaster_id} key={course.coursemaster_id} />
                            ))}
                        </Picker>
                        <Text style={styles.label}>Exam</Text>
                        <Picker selectedValue={selectedExam} style={styles.dropdown} onValueChange={handleExamSelection}
                            dropdownIconColor='gray' dropdownRippleColor='gray'
                        >
                            <Picker.Item label="Select Exam" value="" />
                            {examList.map((exam) => (
                                <Picker.Item label={exam.examname} value={exam.exam_id} key={exam.exam_id} />
                            ))}
                        </Picker>
                    </View>
                    {selectedExam != '' && (
                        <View style={styles.statsContainer}>
                            <View style={styles.statsItem}>
                                <Text style={styles.statsLabel}>Min: {stats.min}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <Text style={styles.statsLabel}>Max: {stats.max}</Text>
                            </View>
                            <View style={styles.statsItem}>
                                <Text style={styles.statsLabel}>Exam Date: {!stats.date ? 'N.A.' : stats.date}</Text>
                            </View>
                        </View>
                    )}
                </View>
                {buttonVisible && (
                    <TouchableOpacity style={styles.button} onPress={handleGetStudentList}>
                        <Text style={styles.buttonText}>GET STUDENTS LIST</Text>
                    </TouchableOpacity>
                )}
                {saveButtonVisible && (
                    <View style={styles.card}>
                        <View style={styles.headingContainer}>
                            <Text style={styles.detailsHeading}>Student Details</Text>
                            <Text style={styles.marksHeading}>Marks</Text>
                            <Text style={styles.marksHeading}>Grade</Text>
                        </View>
                        {studentsList && studentsList.map((item, index) => (
                            <Fragment key={index}>
                                {index !== 0 && renderSeparator(index)}
                                {renderStudentItem(item, index)}
                            </Fragment>
                        ))}
                    </View>
                )}
            </ScrollView>
            {saveButtonVisible && (
                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 60,
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
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'gray',
        marginRight: 10,
    },
    dropdown: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        color:'gray',
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
        color: 'gray',
    },
    button: {
        backgroundColor: '#ffc409',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'normal',
    },
    saveButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        marginBottom: 10,
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
    },
    detailsHeading: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'gray',
        flex: 0.6,
    },
    marksHeading: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'gray',
        flex: 0.2,
        textAlign: 'right',
    },
    studentItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    studentInfo: {
        flex: 0.7,
    },
    studentName: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'gray',
        fontSize: 14,
    },
    studentMarks: {
        flex: 0.15,
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    marksInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        width: '70%',
        color: 'gray',
    },
});

export default ExaminationMarks;
