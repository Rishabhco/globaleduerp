import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, LogBox, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    getCommunicationType,
    getClassesForCommunication,
    getStudentsForCommunication,
    getTeachersForCommunication,
    sendCommunication
} from '../services/communication.services';
import Modal from 'react-native-modal';
import { upload } from '../services/file.services';
import { FileUploadTypeEnum } from '../constants/global.constant';

const SendCommunication = ({navigation}) => {
    const [to, setTo] = useState('1');
    const [communicationType, setCommunicationType] = useState([]);
    const [classes, setClasses] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState(studentsList);
    const [attachment, setAttachment] = useState([]);

    const [selectedCommunicationType, setSelectedCommunicationType] = useState('');
    const [selectedClass, setSelectedClass] = useState([]);
    const [selectedName, setSelectedName] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        getCommunicationType().then((res) => {setCommunicationType(res);}).catch((err) => console.log(err));
        getClassesForCommunication().then((res) => {setClasses(res);}).catch((err) => console.log(err));
        getStudentsForCommunication().then((res) => {setStudentsList(res);}).catch((err) => console.log(err));
        getTeachersForCommunication().then((res) => {setTeachersList(res);}).catch((err) => console.log(err));
    }, []);

    const handleChangeTo = (itemValue) => {
        setTo(itemValue);
        if(itemValue == '2'){ setFilteredStudents(studentsList);}
        setSelectedName([]);
    };

    useEffect(() => {
        if (selectedClass.length > 0) {
            const filteredStudents = studentsList.filter(student => selectedClass.includes(student.batchmaster_id));
            setFilteredStudents(filteredStudents);
        } else {
            setFilteredStudents(studentsList);
        }
    },[selectedClass])

    const handleFileSelection = async () => {
        const results = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles],});
        setAttachment([...attachment, results]);
    }

    const handleRemoveAttachment = (index) => {
        const newAttachment = attachment.filter((item, i) => i !== index);
        setAttachment(newAttachment);
    }

    const handleSend =async () => {
        let recipients = selectedName.join(","); 
        if(to=='1' && selectedName.length==0){
            Alert.alert('Please select teacher');
            return;
        }
        if(to=='2' && selectedName.length==0){
            Alert.alert('Please select student or class');
            return;
        }
        if(subject=="" || message==""){
            Alert.alert('Please enter subject and message');
            return;
        }
        try {
            setIsUploading(true);
            let files = [];
            let totalFiles = attachment.length;
            let uploadedFiles = 0;
            setUploadProgress({ current: uploadedFiles, total: totalFiles });
            for (const item of attachment) {
              const res = await upload(item[0], FileUploadTypeEnum.SendSMSEmail);
              files.push(res);
              uploadedFiles++;
              setUploadProgress({ current: uploadedFiles, total: totalFiles });
            }
            let attachmentString = "";
            for (const file of files) {attachmentString += file.FilePath + "|" + file.ActualFileName + ",";}

            setIsUploading(false);
            setUploadProgress({ current: 0, total: 0 });

            const sendData = {
              commmodeid: 138,
              commtypeid: selectedCommunicationType,
              subject: subject,
              mailsmsbody: message,
              attachment: attachmentString,
              tostd: to === "2" ? recipients : "",
              toemp: to === "1" ? recipients : "",
            };

            sendCommunication(sendData).then(res => {
                Alert.alert('Communication sent successfully.');
                setTimeout(() => {
                    navigation.navigate('Home');
                }, 1000);
            }).catch(err => {
                console.log(err.response)
            });

        }catch (err) {
            console.log(err);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.cardHeading}>To</Text>
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={to}
                            style={styles.dropdown}
                            onValueChange={(itemValue) => handleChangeTo(itemValue)}
                            dropdownIconColor="gray"
                            dropdownRippleColor="gray">
                            <Picker.Item label="Teacher(s)" value="1" />
                            <Picker.Item label="Student(s)" value="2" />
                        </Picker>
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cardHeading}>Communication Type</Text>
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={selectedCommunicationType}
                            style={styles.dropdown}
                            onValueChange={(itemValue) => setSelectedCommunicationType(itemValue)}
                            dropdownIconColor="gray"
                            dropdownRippleColor="gray">
                            <Picker.Item label="Select Type" value="" />
                            {communicationType.map((item) => (
                                <Picker.Item label={item.name} value={item.commtypemaster_id} key={item.commtypemaster_id} />
                            ))}
                        </Picker>
                    </View>
                </View>
                {to === '2' ? (
                    <>
                        <View style={styles.row}>
                            <Text style={styles.cardHeading}>Select Class</Text>
                        </View>
                        <View style={styles.dropdownContainer}>
                            <MultiSelect
                                nestedScrollEnabled={true}
                                items={[{ value: 'all', label: 'Select All' }, ...(classes.map((item) => ({ value: item.batchmaster_id, label: item.class + ' ' + item.section })))]}
                                uniqueKey="value" displayKey="label" selectedItems={selectedClass}
                                onSelectedItemsChange={(items) => {
                                    if (items.includes('all')) {
                                        setSelectedClass(classes.map((item) => item.batchmaster_id));
                                    } else {
                                        setSelectedClass(items);
                                    }
                                }}
                                selectText="Select Class" searchInputPlaceholderText="Search..." selectedItemTextColor="#CCC" selectedItemIconColor="#CCC"
                                itemTextColor="#000" searchInputStyle={{ color: '#CCC' }} hideSubmitButton hideTags style={styles.multiSelect}
                            />
                        </View>
                    </>
                ) : null}
                <View style={styles.row}>
                    <Text style={styles.cardHeading}>{to == '1' ? 'Select Teacher' : 'Select Student'}</Text>
                </View>
                <View style={styles.dropdownContainer}>
                    <MultiSelect
                        items={[{ value: 'all', label: 'Select All' }, ...(to == '1' ? (
                            teachersList.map((item) => ({ label: item.firstname + ' ' + item.lastname, value: item.employeemasterid }))
                        ) : (
                            filteredStudents.map((item) => ({ label: item.studentname, value: item.studentmaster_id }))
                        ))]}
                        uniqueKey="value" displayKey="label" selectedItems={selectedName}
                        onSelectedItemsChange={(items) => {
                            if (items.includes('all')) {
                                setSelectedName(to === '1' ? teachersList.map((item) => item.employeemasterid) : filteredStudents.map((item) => item.studentmaster_id));
                            } else {
                                setSelectedName(items);
                            }

                        }}
                        selectText="Select Name" searchInputPlaceholderText="Search..." selectedItemTextColor="#CCC" selectedItemIconColor="#CCC"
                        itemTextColor="#000" searchInputStyle={{ color: '#CCC' }} hideSubmitButton hideTags style={styles.multiSelect}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Subject</Text>
                    <TextInput
                        style={styles.subInput}
                        placeholder="Subject"
                        value={subject}
                        placeholderTextColor={'gray'}
                        onChangeText={(value) => setSubject(value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={styles.msgInput}
                        placeholder="Message"
                        multiline
                        numberOfLines={4}
                        value={message}
                        placeholderTextColor={'gray'}
                        onChangeText={(value) => setMessage(value)}
                        textAlignVertical="top"
                    />
                </View>
                <TouchableOpacity style={styles.attachmentContainer} onPress={handleFileSelection}>
                    <Text style={styles.attachmentText}>Select Attachment</Text>
                </TouchableOpacity>
                {attachment.length > 0 ? (
                    attachment.map((item, index) => (
                        <View style={styles.attachmentNameContainer} key={index}>
                            <Text style={styles.attachmentText} numberOfLines={1} textOverflow='ellipsis'>{item[0].name}</Text>
                            <Icon name="trash" size={20} color="#ff0000" onPress={() => handleRemoveAttachment(index)} />
                        </View>
                    ))
                ) : null}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSend}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
            <Modal isVisible={isUploading}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Uploading Files...</Text>
                    <Text style={styles.modalText}>{`${uploadProgress.current} / ${uploadProgress.total}`}</Text>
                </View>
            </Modal>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
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
    cardHeading: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        color: 'gray',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 8,
        color: 'gray',
        fontSize: 16,
        marginBottom: 4,
    },
    dropdownContainer: {
        flex: 1,
    },
    dropdown: {
        height: 40,
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        color: 'gray',
    },
    multiSelect: {
        height: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 4,
        marginBottom: 4,
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    subInput: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 8,
        color:"gray"
    },
    msgInput: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 8,
        color:"gray"
    },
    attachmentContainer: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#233698',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'normal',
    },
    attachmentNameContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    attachmentText: {
        flex: 1,
        marginRight: 8,
        color:"gray"
    },
    modalContainer: {
        backgroundColor: '#FFF',
        padding: 20,
        alignItems: 'center',
        borderRadius: 4,
    },
    modalText: {
        marginBottom: 10,
        color:"gray"
    },
});

export default SendCommunication;
