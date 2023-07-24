import { defaultAuthDetail } from "../constants/global.constant";
import {getLoginDetails} from  "../helper/auth.helper"

const headerServices =()=>{
    return new Promise(async(resolve,reject)=>{
        let header={};
        const loginDetails = await getLoginDetails();
            header.Authorization=loginDetails.access_token;
            header.ASGMapping_Id=loginDetails.ASGMapping_Id;
            header.MenuId=defaultAuthDetail.MenuID;
            header.CUserId=loginDetails.CUserId;
            header.SgMapping_id=loginDetails.SgMapping_id;
            header.StuStaffTypeId=loginDetails.StuStaffTypeId;
            header.StuStaff_ID=loginDetails.StuStaff_ID;
            resolve(header);
    }).catch((error) => {
            reject(error);
    });
}

export default headerServices;