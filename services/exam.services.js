import AsyncStorage from "@react-native-async-storage/async-storage"
import { screenIDConstant } from "../constants/screenID.constant"
import { getRecords,performDataOperation } from "./generic.services"
import {getLoginDetails} from  "../helper/auth.helper"

const getAllClassesAndSections = async () => {
    return new Promise((resolve, reject) => {
        const model = {
            screenID: screenIDConstant.GET_TEACHERS_CLASSES_COURSES
        }
        getRecords(model).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })
}

const getExamsData = async (classMasterId, sectionMasterId, subjectMasterId) => {
    return new Promise((resolve, reject) => {
        const model = {
            screenID: screenIDConstant.GET_EXAM_DETAILS_BY_COURSE,
            indexScreenSearchParameterModel: [{
                searchParameter: "classmaster_id",
                searchParameterDataType: "int",
                searchParameterValue: classMasterId
            }, {
                searchParameter: "sectionmaster_id",
                searchParameterDataType: "int",
                searchParameterValue: sectionMasterId
            }, {
                searchParameter: "coursemaster_id",
                searchParameterDataType: "int",
                searchParameterValue: subjectMasterId
            }]
        }
        getRecords(model).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
    })
}

const getStudentsData=async(classID,sectionID,courseID,examID)=>{
    return new Promise((resolve, reject) => {
        const model = {
            screenID: screenIDConstant.GET_EXAM_MARKS,
            indexScreenSearchParameterModel: [{
                searchParameter: "classmaster_id",
                searchParameterDataType: "int",
                searchParameterValue: classID
            }, {
                searchParameter: "sectionmaster_id",
                searchParameterDataType: "int",
                searchParameterValue: sectionID
            }, {
                searchParameter: "coursemaster_id",
                searchParameterDataType: "int",
                searchParameterValue: courseID
            }, {
                searchParameter: "Exam_Id",
                searchParameterDataType: "int",
                searchParameterValue: examID
            }]
        }
        getRecords(model).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })
}

const getStudentGrade=async(examID,courseID,marks)=>{
    return new Promise(async(resolve, reject) => {
        const loginDetails=await getLoginDetails();
            const model={
                screenID:screenIDConstant.GET_STUDENT_GRADES,
                sgMapping_id :Number(loginDetails.SgMapping_id),
                indexScreenSearchParameterModel:[{
                    searchParameter:"Exam_Id",
                    searchParameterDataType:"int",
                    searchParameterValue:examID
                },{
                    searchParameter:"CourseMaster_Id",
                    searchParameterDataType:"int",
                    searchParameterValue:courseID
                },{
                    searchParameter:"Marks",
                    searchParameterDataType:"int",
                    searchParameterValue:marks
                }]
            }
            getRecords(model).then(res=>{
                resolve(res.data);
            }).catch(err=>{
                reject(err);
            });
    })
}

const saveMarks=async(list)=>{
    return new Promise((resolve, reject) => {
        let model={
            menuCode : "1810",
            menuID :126,
            screenID :screenIDConstant.SAVE_STUDENT_MARKS,
            operation :"Update",
            rows:{
                data:[]
            }
        }
        list.forEach((item,index)=>{
            model.rows.data.push({
                rowIndex: index,
                keyName: 'ExamMarks_ID',
                valueData:  item.exammarks_id ? item.exammarks_id.toString() :  null
                
            });
            model.rows.data.push({
                rowIndex: index,
                keyName: 'studentCoursemapping_id',
                valueData: item.studentcoursemapping_id.toString()               
            });
            model.rows.data.push({
                rowIndex:index,
                keyName:'Exam_id',
                valueData:item.exam_id.toString()
            });
            model.rows.data.push({
                rowIndex:index,
                keyName:'Marks',
                valueData:item.marks ? item.marks.toString() :  item.marks
            });
            model.rows.data.push({
                rowIndex:index,
                keyName:'From_mobile',
                valueData: 'true'
            });

        })
        performDataOperation(model).then((response)=>{
            resolve(response);
        }).catch((err)=>{
            console.log(err);
            reject(err);
        })
    })
}

module.exports = {
    getAllClassesAndSections,
    getExamsData,
    getStudentsData,
    getStudentGrade,
    saveMarks
}