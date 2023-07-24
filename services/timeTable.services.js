import AsyncStorage  from "@react-native-async-storage/async-storage";
import { menuCodeConstant } from "../constants/menuCode.constant";
import { getRecords } from "./generic.services";
import {getLoginDetails} from  "../helper/auth.helper"

const getStudentTimeTable=async()=>{
    return new Promise((resolve,reject)=>{
        AsyncStorage.getItem('Profile').then((profile)=>{
            const model={
                screenID:menuCodeConstant.STUDENT_TIME_TABLE,
                indexScreenSearchParameterModel:[{
                    searchParameter: "classmaster_id",
                    searchParameterDataType: "int",
                    searchParameterValue: JSON.parse(profile).classmaster_id?.toString()
                },{
                    searchParameter: "sectionmaster_id",
                    searchParameterDataType: "int",
                    searchParameterValue: JSON.parse(profile).section_id?.toString()
                }]
            }
            getRecords(model).then(res=>{
                resolve(res.data);
            }).catch((err)=>{
                reject(err);
            })
        })
    })
};

const getTeacherTimeTable=async()=>{
    return new Promise(async(resolve,reject)=>{
        const loginDetails=await getLoginDetails();
            const model={
                screenID:menuCodeConstant.TEACHER_TIME_TABLE,
                indexScreenSearchParameterModel:[{
                    searchParameter: "employee_id",
                    searchParameterDataType: "int",
                    searchParameterValue: loginDetails.StuStaff_ID
                }]
            }
            getRecords(model).then((res)=>{
                resolve(res.data);
            }).catch((err)=>{
                reject(err);
            })
    })
}

module.exports={
    getStudentTimeTable,
    getTeacherTimeTable
}