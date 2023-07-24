import  {screenIDConstant} from "../constants/screenID.constant";
import {getRecords} from "./generic.services";

const getClasses=async()=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.CLASS_LIST,
        }
        getRecords(model).then((res)=>{
            resolve(res.data)
        }).catch((err)=>{
            reject(err.response)
        })
    });
}

const getSections=async(classID)=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.SECTION_LIST,
            indexScreenSearchParameterModel:[{
                searchParameter:'Parent_id',
                searchParameterDataType:'int',
                searchParameterValue:classID
            }]
        }
        getRecords(model).then((res)=>{
            resolve(res.data)
        }).catch((err)=>{
            reject(err.response)
        })
    });
}

module.exports={
    getClasses,
    getSections
}