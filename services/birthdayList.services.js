import { screenIDConstant } from "../constants/screenID.constant";
import { getRecords } from "./generic.services";

const getBirthdayList = async (date,userType) => {
    return new Promise((resolve, reject) => {
        const model={
            screenID:screenIDConstant.GET_BIRTHDAYS,
            indexScreenSearchParameterModel:[{
                searchParameter:'UserType',
                searchParameterDataType:'string',
                searchParameterValue:userType
            },{
                searchParameter:'Date',
                searchParameterDataType:'string',
                searchParameterValue:date
            }]
        }
        getRecords(model).then(response=>{
            resolve(response.data);
        }).catch(error=>{    
            reject(error.response);
        });
    });
};

module.exports={
    getBirthdayList
}