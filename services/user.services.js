import { menuCodeConstant } from "../constants/menuCode.constant";
import { screenIDConstant } from "../constants/screenID.constant";
import { getRecords,preformDataOperation}  from "./generic.services";

const getStudentDetails=()=>{
    return new Promise((resolve,reject)=>{
        let model={
            screenID:menuCodeConstant.USER_PROFILE,
        }
        getRecords(model).then(response=>{
            resolve(response.data[0]);
        }).catch(error=>{
            console.log("getStudentDetails error: ",error.response.data);
            reject(error);
        });
    });
}

const getTeacherDetails=()=>{
    return new Promise((resolve,reject)=>{
        let model={
            screenID:menuCodeConstant.USER_PROFILE,
        }
        getRecords(model).then(response=>{
            resolve(response.data[0]);
        }).catch(error=>{
            console.log("getTeacherDetails error: ",error.response.data);
            reject(error);  
        });
    });
}

const saveDetails=async(id,filePath,fileName)=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.UPLOAD_PROFILE_PHOTO,
            rows:[{
                rowIndex: 0,
                keyName: 'UserId ',
                valueData: id.toString()
            },{
                rowIndex: 0,
                keyName: 'UserTypeId',
                valueData: '38'
            },{
                rowIndex: 0,
                keyName: 'ImageFor',
                valueData: '1'
            },{
                rowIndex: 0,
                keyName: 'FilePath',
                valueData: filePath
            },{
                rowIndex: 0,
                keyName: 'ThumPath',
                valueData: filePath
            },{
                rowIndex: 0,
                keyName: 'ActualName',
                valueData: fileName
            }]
        }
        preformDataOperation(model).then((response)=>{
            resolve(response);
        }).catch((err)=>{
            reject(err);
        })
    }).catch((err)=>{
        reject(err)
    })

}

module.exports={
    getStudentDetails,
    getTeacherDetails,
    saveDetails
}