import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getSchoolDetails } from "../helper/auth.helper";

const login = async (username, password) => {
    return new Promise(async (resolve, reject) => {
        const body = {
            username,
            password,
            grant_type: 'password'
        }
        const schoolDetails = await getSchoolDetails();
        axios.post(schoolDetails.schoolendpoint + 'Token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(async (response) => {
            await AsyncStorage.setItem("loginDetails", JSON.stringify(response.data));
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

const logout = async () => {
    return new Promise(async (resolve, reject) => {
        const schoolDetails = await getSchoolDetails();
        const schoolCode = schoolDetails.schoolcode;
        await AsyncStorage.clear();
        await AsyncStorage.setItem("schoolcode", schoolCode);
        await AsyncStorage.setItem("isLoggedIn", "false");
        console.log('AsyncStorage cleared successfully.');
        resolve("Logout Successfully")
    })
}

module.exports = {
    login,
    logout
};