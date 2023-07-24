import { screenIDConstant } from "../constants/screenID.constant";
import { getRecords, performDataOperation } from "./generic.services";
import { menuCodeConstant } from "../constants/menuCode.constant";
import { getLoginDetails } from "../helper/auth.helper"

const getCommType = async () => {
    return new Promise(async (resolve, reject) => {
        const loginDetails = await getLoginDetails();
        const model = {
            aSGMapping_Id: Number(loginDetails.ASGMapping_Id),
            sgMapping_id: Number(loginDetails.SgMapping_id),
            screenID: screenIDConstant.COMM_TYPE_FOR_MOBILE
        };
        getRecords(model).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error.response.data);
        })
    })
}

const getCommunication = async () => {
    return new Promise(async (resolve, reject) => {
        const loginDetails = await getLoginDetails();
        const model = {
            aSGMapping_Id: Number(loginDetails.ASGMapping_Id),
            sgMapping_id: Number(loginDetails.SgMapping_id),
            screenID: screenIDConstant.COMM_DETAILS
        }
        getRecords(model).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error.response.data);
        })
    });
}

const getCommunicationDetail = async (id) => {
    return new Promise(async (resolve, reject) => {
        const loginDetails = await getLoginDetails();
        const model = {
            aSGMapping_Id: Number(loginDetails.ASGMapping_Id),
            sgMapping_id: Number(loginDetails.SgMapping_id),
            screenID: screenIDConstant.COMM_DETAIL_BYID,
            indexScreenSearchParameterModel: [{
                searchParameter: "commToSend_Id",
                searchParameterDataType: "int",
                searchParameterValue: id
            }]
        }
        getRecords(model).then((response) => {
            resolve(response.data[0]);
        }).catch((error) => {
            reject(error.response.data);
        })
    });
}

const getCommunicationType = async () => {
    return new Promise((resolve, reject) => {
        const model = {
            screenID: screenIDConstant.GET_COMMUNICATION_TYPE_BY_ID
        }
        getRecords(model).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}

const getClassesForCommunication = async () => {
    return new Promise((resolve, reject) => {
        const model = {
            screenID: screenIDConstant.GET_CLASS_DATA_FOR_COMMUNICATION
        }
        getRecords(model).then(res => resolve(res.data)).catch(err => reject(err));
    })
}

const getStudentsForCommunication = async () => {
    return new Promise((resolve, reject) => {
        const model = {
            screenID: screenIDConstant.GET_STUDENT_LIST_FOR_COMMUNICATION
        }
        getRecords(model).then(res => resolve(res.data)).catch(err => reject(err));
    })
}

const getTeachersForCommunication = async () => {
    return new Promise((resolve, reject) => {
        const model = {
            screenID: screenIDConstant.GET_EMPLOYEE_LIST_FOR_COMMUNICATION
        }
        getRecords(model).then(res => resolve(res.data)).catch(err => reject(err));
    })
}

const sendCommunication = async (element) => {
    return new Promise((resolve, reject) => {
        const model = {
            screenID: screenIDConstant.SEND_COMMUNICATION,
            menuCode: menuCodeConstant.SendCommunication,
            menuID: 126,
            operation: "Add",
            rows: {
                data: []
            }
        }
        model.rows.data.push({
            rowIndex: 0,
            keyName: 'mailsmsbody',
            valueData: element.mailsmsbody
        })
        model.rows.data.push({
            rowIndex: 0,
            keyName: 'CommTypeId',
            valueData: element.commtypeid.toString()
        });
        model.rows.data.push({
            rowIndex: 0,
            keyName: 'CommModeId',
            valueData: '138'
        });
        model.rows.data.push({
            rowIndex: 0,
            keyName: 'Subject',
            valueData: element.subject
        });
        model.rows.data.push({
            rowIndex: 0,
            keyName: 'CommOperationType',
            valueData: 'SENDANDSAVE'
        });
        model.rows.data.push({
            rowIndex: 0,
            keyName: 'ToStd',
            valueData: element.tostd
        });
        model.rows.data.push({
            rowIndex: 0,
            keyName: 'ToEmp',
            valueData: element.toemp
        });
        model.rows.data.push({
            rowIndex: 0,
            keyName: 'Attachments',
            valueData: element.attachment
        });
        performDataOperation(model).then(res => resolve(res.data)).catch(err => reject(err));
    })
}

module.exports = {
    getCommType,
    getCommunication,
    getCommunicationDetail,
    getCommunicationType,
    getClassesForCommunication,
    getStudentsForCommunication,
    getTeachersForCommunication,
    sendCommunication
}