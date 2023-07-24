import { menuCodeConstant } from "../constants/menuCode.constant"
import { screenIDConstant } from "../constants/screenID.constant"
import { getRecords } from "./generic.services"

const getAllCalendarDetail=async(fromDate,toDate)=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:menuCodeConstant.STUDENT_CALENDAR,
            indexScreenSearchParameterModel:[{
                searchParameter:'fromDate',
                searchParameterDataType:'string',
                searchParameterValue:fromDate
            },{
                searchParameter:'toDate',
                searchParameterDataType:'string',
                searchParameterValue:toDate
            }]
        }
        getRecords(model).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
    })
}

const getCalendarDetailByDate=async(fromDate,toDate)=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.STUDENT_CALENDAR_DAY_DETAIL,
            indexScreenSearchParameterModel:[{
                searchParameter:'fromDate',
                searchParameterDataType:'string',
                searchParameterValue:fromDate
            },{
                searchParameter:'toDate',
                searchParameterDataType:'string',
                searchParameterValue:toDate
            }]
        }
        getRecords(model).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
    })
}

module.exports={
    getCalendarDetailByDate,
    getAllCalendarDetail
}