import { menuCodeConstant } from "./menuCode.constant";
import { menuIDConstant } from "./menuID.constant";

export const defaultAuthDetail={
    IsLoggedIn: false, 
    access_token: '',
    ASGMapping_Id: '3',
    CUserId: '1',
    SgMapping_id: '2',
    StuStaff_ID: '',
    StuStaffTypeId: '39',
    MenuCode: menuCodeConstant.MobileGeneric,
    MenuID: menuIDConstant.MobileGeneric.toString(), 
    Lang: "en", 
    UserID: "1",
    GroupID: "1",
    UserGroupID: "3"
}

export const SysMaster={
    Holiday: 9,
    Event: 41
}

export const UserType ={
    Student :'stu',
    Employee :'emp'
}

export const UserTypeIdConstant = {
    Candidate: 39,
    Student: 38,
    Teacher: 37
}

export const FileUploadTypeEnum ={
    SendSMSEmail : 1,
    SendAsdsignment : 2,
    SubmitAssignment : 3,
    AssessmentAttach : 4,
    TeacherAssignmentEvaluation : 5,
    ELearning : 6,
    AssessmentQuestionImage : 7,
    ImageGallery : 8,
    ImgProfile : 9
}