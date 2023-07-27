import {uploadFile,deleteFile} from './generic.services'

const upload=async(file,fileType)=>{
    return new Promise((resolve,reject)=>{
        const formData=new FormData();
        formData.append(file.name, file);
        formData.append('fileUploadType', fileType.toString());
        uploadFile(formData).then((res)=>{
            resolve(res.data[0])
        }).catch((err)=>{
            reject(err)
        })
    })
}

const deleteF=async(fileUrl)=>{
    return new Promise((resolve,reject)=>{
        deleteFile(fileUrl).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports={
    upload,
    deleteF
}