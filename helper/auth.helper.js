import AsyncStorage from '@react-native-async-storage/async-storage';

const getSchoolDetails = async () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem("schoolDetails").then(schoolDetail => {
            const data = {
                school_id: JSON.parse(schoolDetail).school_id,
                schoolendpoint: JSON.parse(schoolDetail).schoolendpoint,
                schoolwebendpoint: JSON.parse(schoolDetail).schoolwebendpoint,
                schoolcode: JSON.parse(schoolDetail).schoolcode,
                schoolgroup_id: JSON.parse(schoolDetail).schoolgroup_id,
                schoolname: JSON.parse(schoolDetail).schoolname,
                schoollogo: JSON.parse(schoolDetail).schoollogo,
                menunotvisible: JSON.parse(schoolDetail).menunotvisible,
                isforce: JSON.parse(schoolDetail).isforce,
                mobilecodeversion: JSON.parse(schoolDetail).mobilecodeversion,
                ioslink: JSON.parse(schoolDetail).ioslink,
            }
            resolve(data);
        }).catch(error => {
            reject("School Details not Found");
        })
    })
}

const getLoginDetails = async () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem("loginDetails").then(loginDetails => {
            const data = {
                ASGMapping_Id: JSON.parse(loginDetails).ASGMapping_Id,
                CUserId: JSON.parse(loginDetails).CUserId,
                FirstName: JSON.parse(loginDetails).FirstName,
                Id:  JSON.parse(loginDetails).Id,
                IsDeactive:  JSON.parse(loginDetails).IsDeactive,
                LastName:  JSON.parse(loginDetails).LastName,
                MultiSchool:  JSON.parse(loginDetails).MultiSchool,
                ProfilePhoto:  JSON.parse(loginDetails).ProfilePhoto,
                SchoolGroupId:  JSON.parse(loginDetails).SchoolGroupId,
                SchoolId:  JSON.parse(loginDetails).SchoolId,
                SgMapping_id:  JSON.parse(loginDetails).SgMapping_id,
                StuStaffTypeId: JSON.parse(loginDetails).StuStaffTypeId,
                StuStaff_ID: JSON.parse(loginDetails).StuStaff_ID,
                UserGroupId: JSON.parse(loginDetails).UserGroupId,
                UserTheme: JSON.parse(loginDetails).UserTheme,
                access_token: JSON.parse(loginDetails).access_token,
                expires_in: JSON.parse(loginDetails).expires_in,
                refresh_token: JSON.parse(loginDetails).refresh_token,
                token_type:  JSON.parse(loginDetails).token_type,
                userName: JSON.parse(loginDetails).userName,
            }
            resolve(data);
        }).catch(error => {
            reject("Login Details not Found");
        })
    })
}

module.exports = {
    getSchoolDetails,
    getLoginDetails
}