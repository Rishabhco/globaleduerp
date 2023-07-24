import React, {useState, useEffect} from 'react';
import {getStudentDetail} from '../services/student.services';
import {View, Text, StyleSheet, Image, ScrollView,TouchableOpacity,BackHandler} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FileUploadTypeEnum } from '../constants/global.constant';
import { deleteF, upload} from '../services/file.services';
import {saveDetails} from '../services/user.services';

const StudentProfile = ({route,navigation}) => {
  const [profile, setProfile] = useState({});
  const [imageSrc, setImageSrc] = useState("");
  const [imageData, setImageData] = useState({});

  useEffect(() => {
    getStudentDetail(route?.params?.student?.studentmaster_id).then((res)=>{
      setProfile(res[0]);
      setImageSrc(res[0].profilepic);
    }).catch(err=>{
      console.log(err);
    })
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
    navigation.setOptions({
      headerTitle: 'Profile',
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={styles.saveButtonContainer}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  },[navigation,imageSrc]);

  const handleEditImage = async() => {
    let pickedImageData = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
    });
    setImageData(pickedImageData.assets[0]);
    setImageSrc(pickedImageData.assets[0].uri);
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop();
  };

  const handleSave = async () => {
    if(imageSrc !== profile.profilepic){
      await deleteF(profile.profilepic);
      const base64res=await fetch(imageData.uri);
      let blob= await base64res.blob();
      let fil=new File([blob],route?.params?.student?.studentmaster_id + '.' + getFileExtension(imageData.fileName),{type: imageData.type});
      const res = await upload(fil, FileUploadTypeEnum.SendSMSEmail);
      if(res){
        const filePath = res.FilePath;
        const fileName = res.ActualFileName;
        saveDetails(route?.params?.student?.studentmaster_id,filePath, fileName).then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.sectionContainer, styles.imageContainer]}>
        <TouchableOpacity activeOpacity={1.2}>
          {imageSrc ? (
            <Image style={styles.profileImage} source={{ uri: imageSrc }} />
          ) : (
            <Image source={require('../assets/user1.jpg')} style={styles.profileImage} />
          )}
          <TouchableOpacity style={styles.editIconContainer} onPress={handleEditImage}>
            <Icon name="edit" size={24} style={styles.editIcon}/>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>{!profile.studentname ? 'student name' : profile.studentname}</Text>
            <Text style={styles.textStyle}>{!profile.contactmobileno ? 'mobile no' : profile.contactmobileno}</Text>
            <Text style={styles.textStyle}>{!profile.dob ? 'dob' : profile.dob}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.sectionContainer, styles.detailsContainer]}>
        <View style={styles.detailsItem}>
          <Text style={styles.heading}>Admission Number</Text>
          <Text style={styles.textStyle}>
            {!profile.admissionnumber
              ? 'admission no'
              : profile.admissionnumber}
          </Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.heading}>Class Teacher</Text>
          <Text style={styles.textStyle}>
            {!profile.classteacher ? 'class teacher' : profile.classteacher}
          </Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.heading}>Class</Text>
          <Text style={styles.textStyle}>
            {profile.classname + ', ' + profile.sectionname}
          </Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.heading}>Roll No.</Text>
          <Text style={styles.textStyle}></Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.heading}>Blood Group</Text>
          <Text style={styles.textStyle}>
            {!profile.bloodgroup ? 'blood group' : profile.bloodgroup}
          </Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.heading}>Father's Name</Text>
          <Text style={styles.textStyle}>
            {profile.fathefirstname +
              (!profile.fatherlasttname ? '' : ' ' + profile.fatherlasttname)}
          </Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.heading}>Mother's Name</Text>
          <Text style={styles.textStyle}>
            {profile.motherfirstname +
              (!profile.motherlasttname ? '' : ' ' + profile.motherlasttname)}
          </Text>
        </View>
        <View style={styles.detailsItem}>
          <Text style={styles.heading}>Address</Text>
          <Text style={styles.textStyle}>
            {(!profile.address1 ? '' : profile.address1) +
              ', ' +
              (!profile.address2 ? '' : profile.address2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  sectionContainer: {
    flex: 1,
    padddingVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaeaf4',
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    height: 160,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#233698',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#222222',
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  detailsItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    fontSize: 14,
    width: '100%',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#222222',
  },
  textStyle: {
    color: '#222222',
  },
  editIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  editIcon: {
    fontWeight: 'bold',
    color:"#233698" ,
    backgroundColor:"#eaeaf4",
    borderRadius: 10,
  },
  saveButtonContainer: {
    marginRight: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default StudentProfile;
