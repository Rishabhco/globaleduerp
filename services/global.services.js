import AsyncStorage from "@react-native-async-storage/async-storage";
import { screenIDConstant } from "../constants/screenID.constant";
import axios from "axios";
import { environment } from "../environments/environment";

const getSchoolDetails = async (schoolcode) => {
    return new Promise((resolve, reject) => {
        let model = {
            screenID: screenIDConstant.GBL_SCHOOL_DETAIL,
            indexScreenSearchParameterModel: [{
                searchParameter: "schoolcode",
                searchParameterDataType: "string",
                searchParameterValue: schoolcode
            }]
        }

        axios.post(environment.gblApiUrl + "api/generic/GetRecords", model, {
            headers: {
                'CUserId': '1',
                'MenuId': '1',
                'ASGMapping_Id': '1',
                'SgMapping_id': '1'
            }
        }).then(async (response) => {
            if (response.data.length != 0) {
                const data = response.data[0];
                await AsyncStorage.setItem("schoolDetails", JSON.stringify(data));
            }
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export default getSchoolDetails;