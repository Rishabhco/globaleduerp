import AsyncStorage from '@react-native-async-storage/async-storage';

const setStudentDetails=async (detail)=>{
    await AsyncStorage.setItem("Profile",JSON.stringify(detail));
};

const setTeacherDetails=async (detail)=>{
    await AsyncStorage.setItem("Profile",JSON.stringify(detail));
};

module.exports={
    setStudentDetails,
    setTeacherDetails
}