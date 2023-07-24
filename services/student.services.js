import { UserTypeIdConstant } from "../constants/global.constant";
import { menuCodeConstant } from "../constants/menuCode.constant";
import { screenIDConstant } from "../constants/screenID.constant";
import {getRecords} from './generic.services'

const getAllStudents=async(classID,sectionID)=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.GET_ALL_STUDENT,
            indexScreenSearchParameterModel:[{
                searchParameter:'ClassId',
                searchParameterDataType:'int',
                searchParameterValue:classID
            },{
                searchParameter:'SecId',
                searchParameterDataType:'int',
                searchParameterValue:sectionID
            }]
        }
        getRecords(model).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{
            reject(err.response);
        })
    })
}

const getStudentDetail=async(id)=>{
    return new Promise((resolve,reject)=>{
        let model={
            screenID:menuCodeConstant.USER_PROFILE
        }
        if(id){
            model.indexScreenSearchParameterModel=[{
                searchParameter:'MasterId',
                searchParameterDataType:'int',
                searchParameterValue:id.toString(),
            },{
                searchParameter:'UserTypeId',
                searchParameterDataType:'int',
                searchParameterValue:UserTypeIdConstant.Student.toString(),
            }]
        }
        getRecords(model).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{
            reject(err.response);
        })
    })
}

module.exports={
    getAllStudents,
    getStudentDetail
}