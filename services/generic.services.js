import headerServices from "./header.services";
import axios from "axios";
import { getSchoolDetails } from "../helper/auth.helper";

const getRecords = async (body) => {
    return new Promise(async (resolve, reject) => {
        const headers = await headerServices();
        const schoolDetails = await getSchoolDetails();
        axios.post(schoolDetails.schoolendpoint + 'api/Generic/GetRecords', body, {
            headers: {
                'Authorization': headers.Authorization,
                'ASGMapping_Id': headers.ASGMapping_Id,
                'MenuId': headers.MenuId,
                'CUserId': headers.CUserId,
                'SgMapping_id': headers.SgMapping_id,
                'StuStaffTypeId': headers.StuStaffTypeId,
                'StuStaff_ID': headers.StuStaff_ID,
            }
        }).then(async (response) => {
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    });
};

const getRecord = async (body) => {
    return new Promise(async (resolve, reject) => {
        const headers = await headerServices();
        const schoolDetails = await getSchoolDetails();
        axios.post(schoolDetails.schoolendpoint + 'api/Generic/GetRecords', body, {
            headers: {
                'Authorization': headers.Authorization,
                'ASGMapping_Id': headers.ASGMapping_Id,
                'MenuId': headers.MenuId,
                'CUserId': headers.CUserId,
                'SgMapping_id': headers.SgMapping_id,
                'StuStaffTypeId': headers.StuStaffTypeId,
                'StuStaff_ID': headers.StuStaff_ID,
            }
        }).then(async (response) => {
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    });
}

const performDataOperation = async (body) => {
    return new Promise(async (resolve, reject) => {
        const headers = await headerServices();
        const schoolDetails = await getSchoolDetails();
        axios.post(schoolDetails.schoolendpoint + 'api/Generic/PerformDataOperation', body, {
            headers: {
                'Authorization': headers.Authorization,
                'ASGMapping_Id': headers.ASGMapping_Id,
                'MenuId': headers.MenuId,
                'CUserId': headers.CUserId,
                'SgMapping_id': headers.SgMapping_id,
                'StuStaffTypeId': headers.StuStaffTypeId,
                'StuStaff_ID': headers.StuStaff_ID,
            }
        }).then(async (response) => {
            resolve(response);
        }).catch(error => {
            if(axios.isAxiosError(error)){
                console.log(error.response);
            }
            reject(error);
        })
    });
}

const uploadFile = async (body) => {
    return new Promise(async (resolve, reject) => {
        const headers = await headerServices();
        const schoolDetails = await getSchoolDetails();
        axios.post(schoolDetails.schoolwebendpoint + 'MobileReport/FileUploader', body, {
            headers: {
                'Authorization': headers.Authorization,
                'ASGMapping_Id': headers.ASGMapping_Id,
                'MenuId': headers.MenuId,
                'CUserId': headers.CUserId,
                'SgMapping_id': headers.SgMapping_id,
                'StuStaffTypeId': headers.StuStaffTypeId,
                'StuStaff_ID': headers.StuStaff_ID,
                'Content-Type': 'multipart/form-data'
            }
        }).then(async (response) => {
            resolve(response);
        }).catch(error => {
            console.log(error);
            if (axios.isAxiosError(error)) {
                console.log(error);
            }
            reject(error);
        })
    });
}

const deleteFile = async (body) => {
    return new Promise(async (resolve, reject) => {
        const headers = await headerServices();
        const schoolDetails = await getSchoolDetails();
        axios.post(schoolDetails.schoolwebendpoint + 'MobileReport/DeleteFileUploaded?filePath=' + body, {}, {
            headers: {
                'Authorization': headers.Authorization,
                'ASGMapping_Id': headers.ASGMapping_Id,
                'MenuId': headers.MenuId,
                'CUserId': headers.CUserId,
                'SgMapping_id': headers.SgMapping_id,
                'StuStaffTypeId': headers.StuStaffTypeId,
                'StuStaff_ID': headers.StuStaff_ID,
            }
        }).then(async (response) => {
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    });
}

module.exports = {
    getRecords,
    performDataOperation,
    getRecord,
    uploadFile,
    deleteFile,
}