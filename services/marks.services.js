import { screenIDConstant } from "../constants/screenID.constant";
import { getRecords } from "./generic.services";

const getMarks=async ()=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.GET_STUDENT_EXAM_MARK
        }
        getRecords(model).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{
            reject(err);
        })
    })
}

module.exports={
    getMarks
}