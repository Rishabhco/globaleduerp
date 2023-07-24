import moment from 'moment';
import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button, Switch, Alert,BackHandler} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getClasses, getSections } from '../services/class.services';
import { getAttendanceStudentList,saveAttendance } from '../services/attendance.services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';

const StudentAttendance = ({navigation}) => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [classList, setClassList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [sessionDate, setSessionDate] = useState(null);
    const [attendanceDate, setAttendanceDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [studentButtonVisible, setStudentButtonVisible] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);
    const [saveButtonText, setSaveButtonText] = useState('Save');
    const [studentList, setStudentList] = useState([]);
    const [studentBackupList, setStudentBackupList] = useState([]);
    const [stats, setStats] = useState({
        totalPresent: 0,
        totalAbsent: 0,
    });
    const [markAllPresent, setMarkAllPresent] = useState(false);
    const [notifyAbsent, setNotifyAbsent] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('Profile').then(res => {
            setSessionDate(JSON.parse(res).sessionyearstartdate);
        });
        getClassList();
    }, []);

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
        if (selectedClass) {
            getSectionList(selectedClass);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedSection != '') {
            setStudentButtonVisible(true);
            setButtonVisible(false);
        }
    }, [selectedSection]);

    const getClassList = () => {
        getClasses().then(res => {
            setClassList(res);
        }).catch(err => {
            console.log(err);
        });
    };

    const getSectionList = selectedClass => {
        getSections(selectedClass).then(res => {
            setSectionList(res);
            setSelectedSection(res[0].id);
        }).catch(err => {
            console.log(err);
        });
        setStudentButtonVisible(true);
        setButtonVisible(false);
    };

    const handleDatePicker = date => {
        setAttendanceDate(date);
        setStudentButtonVisible(true);
        setButtonVisible(false);
    };

    const handleGetStudentList = () => {
        getAttendanceStudentList(selectedClass, selectedSection, moment(attendanceDate).format('yyyy-MM-DD'),).then(res => {
            setStudentList(res);
            setStudentBackupList(res);
            setStats({
                totalPresent: res.filter(x => x.pstatus).length,
                totalAbsent: res.filter(x => !x.pstatus).length,
            });
            setStudentButtonVisible(false);
            setButtonVisible(true);
        }).catch(err => {
            console.log(err);
        });
    };

    const handleSave = () => {
        saveAttendance(studentList,moment(attendanceDate).format('yyyy-MM-DD'),saveButtonText).then(res=>{
            Alert.alert('Success', 'Attendance Saved Successfully');
            setStudentList([]);
            setStudentBackupList([]);
            setStats({
                totalPresent: 0,
                totalAbsent: 0,
            });
            handleGetStudentList();
        }).catch(err=>{
            Alert.alert('Error', 'Something went wrong');
        })
    };

    const onMarkAllPresent = () => {
        setMarkAllPresent(!markAllPresent);
        if (!markAllPresent) {
            const updatedStudents = studentList.map(student => ({
                ...student,
                pstatus: true,
            }));
            setStudentList(updatedStudents);
            setStats({
                totalPresent: updatedStudents.length,
                totalAbsent: 0,
            })
        } else {
            setStudentList([...studentBackupList]);
            setStats({
                totalPresent: studentBackupList.filter(x => x.pstatus).length,
                totalAbsent: studentBackupList.filter(x => !x.pstatus).length,
            })
        }
    }

    const onNotifyAbsent = () => {
        setNotifyAbsent(!notifyAbsent);
        setSaveButtonText(saveButtonText === 'Save' ? 'Save & Notify' : 'Save');
    }

    const handleToggleAttendance = batchstudentmapping_id => () => {
        let student = studentList.find(x => x.batchstudentmapping_id === batchstudentmapping_id);
        student.pstatus = !student.pstatus;
        setStudentList([...studentList]);
        setStats({
            totalPresent: studentList.filter(x => x.pstatus).length,
            totalAbsent: studentList.filter(x => !x.pstatus).length,
        });
    };

    const renderStudentItem = (item, index) => {
        return (
            <View style={styles.studentItemContainer} >
                <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>Admission Number: {item.admissionnumber}</Text>
                    <Text style={styles.studentName}>Name: {item.sname}</Text>
                    <Text style={styles.studentName}>Gender: {item.gender}</Text>
                </View>
                <Switch trackColor={{ false: 'red', true: 'green' }} thumbColor={item.pstatus ? 'green' : 'red'} value={item.pstatus}
                    onValueChange={handleToggleAttendance(item.batchstudentmapping_id)}
                />
            </View>
        );
    };

    const renderSeparator = (index) => (index !== studentList.length - 1 && <View style={styles.separator} />);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.cardHeading}>Class</Text>
                        <View style={styles.dropdownContainer}>
                            <Picker selectedValue={selectedClass} style={styles.dropdown} onValueChange={itemValue => setSelectedClass(itemValue)}
                                dropdownIconColor='gray' dropdownRippleColor='gray'
                            >
                                <Picker.Item label="Select Class" value="" />
                                {classList.map(classItem => (
                                    <Picker.Item label={classItem.displayname} value={classItem.id} key={classItem.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.cardHeading}>Section</Text>
                        <View style={styles.dropdownContainer}>
                            <Picker selectedValue={selectedSection} style={styles.dropdown} onValueChange={itemValue => setSelectedSection(itemValue)}
                                dropdownIconColor='gray' dropdownRippleColor='gray'
                            >
                                <Picker.Item label="Select Section" value="" />
                                {sectionList.map(section => (
                                    <Picker.Item label={section.displayname} value={section.id} key={section.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.cardHeading}>Attendance Date</Text>
                        <Button style={styles.dateButton} color="#233698" title={moment(attendanceDate).format('DD MMM YYYY')} onPress={() => setOpen(true)} />
                        <DatePicker modal open={open} style={styles.datePicker} date={attendanceDate} mode="date" placeholder="Select Date"
                            format="DD MM YYYY" minimumDate={new Date(sessionDate)} maximumDate={new Date()} confirmText="Confirm" cancelText="Cancel"
                            customStyles={{
                                dateInput: styles.dateInput,
                                placeholderText: styles.placeholderText,
                                dateText: styles.dateText,
                            }}
                            onConfirm={date => {
                                setOpen(false);
                                handleDatePicker(date);
                            }}
                            onCancel={() => {
                                setOpen(false);
                            }}
                        />
                    </View>
                    {buttonVisible && (
                        <View style={styles.statsContainer}>
                            <View style={styles.statsItem}>
                                <Text style={styles.statsLabel}>Total: {stats.totalAbsent + stats.totalPresent} </Text>
                            </View>
                            <View style={styles.statsItem}>
                                <Text style={styles.statsLabel}>Present:{' '}<Text style={styles.presentText}>{stats.totalPresent}</Text></Text>
                            </View>
                            <View style={styles.statsItem}>
                                <Text style={styles.statsLabel}>Absent:{' '}<Text style={styles.absentText}>{stats.totalAbsent}</Text></Text>
                            </View>
                        </View>
                    )}
                </View>
                {studentButtonVisible && (
                    <TouchableOpacity style={styles.button} onPress={handleGetStudentList}>
                        <Text style={styles.buttonText}>GET STUDENTS LIST</Text>
                    </TouchableOpacity>
                )}
                {buttonVisible && (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.cardHeading}>Mark Everyone Present</Text>
                            <Switch value={markAllPresent} onValueChange={onMarkAllPresent} />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cardHeading}>Notify Absent</Text>
                            <Switch
                                value={notifyAbsent}
                                onValueChange={value => onNotifyAbsent(value)}
                            />
                        </View>
                        {studentList.map((item, index) => (
                            <Fragment key={index}>
                                {index !== 0 && renderSeparator()}
                                {renderStudentItem(item, index)}
                            </Fragment>
                        ))}
                    </View>
                )}
            </ScrollView>
            {buttonVisible && (
                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>{saveButtonText}</Text>
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
        paddingBottom: 60, // Adjust paddingBottom to accommodate the sticky Save button
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
        color: 'gray',
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
    datePicker: {
        flex: 1,
        width: 100,
    },
    dateInput: {
        borderWidth: 0,
        alignItems: 'flex-start',
        paddingLeft: 5,
    },
    placeholderText: {
        color: '#ccc',
        fontSize: 16,
    },
    dateText: {
        fontSize: 16,
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
    presentText: {
        color: 'green',
    },
    absentText: {
        color: 'red',
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
    studentItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'gray',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
});

export default StudentAttendance;
