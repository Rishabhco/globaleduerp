import { screenIDConstant } from "../constants/screenID.constant";
import { getRecord,getRecords } from "./generic.services";


const getAssignments=async()=>{
    return new Promise((resolve,reject)=>{
        let model={
            screenID:screenIDConstant.GET_ASSIGNMENTS,
        }
        getRecords(model).then(response=>{
            resolve(response.data);
        }).catch(error=>{
            reject(error);
        });
    });
}


const getAssignmentDetailByID=async(id)=>{
    return new Promise((resolve,reject)=>{
        let model={
            screenID:screenIDConstant.GET_ASSIGNMENT_BY_ID,
            indexScreenSearchParameterModel:[{
                searchParameter:'commassingment_id',
                searchParameterDataType:'int',
                searchParameterValue:id.toString()
            }]
        }
        getRecord(model).then(response=>{
            resolve(response.data[0]);
        }).catch(error=>{
            reject(error);
        });
    });
}

module.exports={
    getAssignments,
    getAssignmentDetailByID
}