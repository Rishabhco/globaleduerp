import { UserType } from"../constants/global.constant";
import { screenIDConstant } from "../constants/screenID.constant";
import {getRecords} from './generic.services';

const getEmpHolidayList=async ()=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.GET_HOLIDAYS,
            indexScreenSearchParameterModel:[{
                searchParameter: "UserType",
                searchParameterDataType: "string",
                searchParameterValue: UserType.Employee
            }]
        }
        getRecords(model).then((res)=>{
            resolve(res.data)
        }).catch((err)=>{
            reject(err)
        })
    })
}

const getStuHolidayList=async ()=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.GET_HOLIDAYS,
            indexScreenSearchParameterModel:[{
                searchParameter: "UserType",
                searchParameterDataType: "string",
                searchParameterValue: UserType.Student
            }]
        }
        getRecords(model).then((res)=>{
            resolve(res.data)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports={
    getEmpHolidayList,
    getStuHolidayList
}