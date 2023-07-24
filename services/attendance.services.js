import { menuCodeConstant } from "../constants/menuCode.constant";
import { screenIDConstant } from "../constants/screenID.constant";
import {getRecords,performDataOperation} from './generic.services';

const getAttendanceStudentList=async(classID,sectionID,date)=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.SAVE_STUDENT_ATTENDANCE,
            indexScreenSearchParameterModel:[{
                searchParameter:'classmaster_id',
                searchParameterDataType:'int',
                searchParameterValue:classID
            },{
                searchParameter:'sectionid',
                searchParameterDataType:'int',
                searchParameterValue:sectionID
            },{
                searchParameter:'attendancedate',
                searchParameterDataType:'string',
                searchParameterValue:date
            }]
        }
        getRecords(model).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{
            reject(err);
        });
    })
}

const saveAttendance=async(list,date,text)=>{
    return new Promise((resolve,reject)=>{
        let model={
            menuCode : "1810",
            menuID :126,
            screenID :screenIDConstant.SAVE_STUDENT_ATTENDANCE,
            operation :"Update",
            rows:{
                data:[]
            }
        }
        list.forEach((item,index)=>{
            model.rows.data.push({
                rowIndex: index,
                keyName: 'batchstudentmapping_id',
                valueData: item.batchstudentmapping_id.toString()
            });
            model.rows.data.push({
                rowIndex: index,
                keyName: 'pstatus',
                valueData: item.pstatus.toString()                
            });
            model.rows.data.push({
                rowIndex:index,
                keyName:'attendancedate',
                valueData:date
            });
            model.rows.data.push({
                rowIndex:index,
                keyName:'smid',
                valueData:item.smid.toString()
            });
            model.rows.data.push({
                rowIndex:index,
                keyName:'studentattendance_id',
                valueData:item.studentattendance_id == null ? null : item.studentattendance_id.toString()
            });
            model.rows.data.push({
                rowIndex:index,
                keyName:'isnotified',
                valueData:text == 'Save' ? 'false' : 'true'
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

const getStudentMonthlyAttendance=async(fromDate,toDate)=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:menuCodeConstant.STUDENT_ATTENDANCE,
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
        getRecords(model).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{
            reject(err);
        });
    });
}

const getStudentAttendanceSummary=async(fromDate,toDate)=>{
    return new Promise((resolve,reject)=>{
        const model={
            screenID:screenIDConstant.STUDENT_ATTENDANCE_SUMMARY,
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
        getRecords(model).then((res)=>{
            resolve(res.data);
        }).catch((err)=>{
            reject(err);
        });
    });
}

module.exports={
    getAttendanceStudentList,
    saveAttendance,
    getStudentMonthlyAttendance,
    getStudentAttendanceSummary,
}