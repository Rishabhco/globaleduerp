import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Linking,PermissionsAndroid,Platform,BackHandler} from 'react-native';
import { getAssignmentDetailByID } from '../services/assignment.services';
import moment from 'moment';
import { getFileName } from '../helper/utility.helper.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'rn-fetch-blob';

const AssignmentDetail = ({ route,navigation }) => {
  const [assignment, setAssignment] = useState({});
  const [attachment, setAttachment] = useState([]);

  useEffect(() => {
    getAssignmentDetailByID(route.params.id).then((res) => {
        const attachments = res.attachments ? res.attachments.split(',') : [];
        const filenames = res.filenames ? res.filenames.split(',') : [];
        setAttachment([]);
        if (attachments) {
          attachments.forEach((item, index) => {
            const fileName = filenames[index] ? filenames[index] : getFileName(item);
            const attachmentObject = {
              filepath: item,
              fileName: fileName,
            };
            setAttachment((attachment) => [...attachment, attachmentObject]);
          });
        }
        setAssignment(res);
      }).catch((err) => {
        console.log(err);
      });
      const handleBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
  }, [route.params.id]);

  const handleIconPress = (filePath,action,fileName) => {
    if(action === 'download'){
      checkPermission(filePath,fileName);
    }else if(action === 'view'){
      Linking.openURL(filePath);
    }
  };

  const checkPermission = async (filePath,fileName) => {
    if (Platform.OS === 'ios') {
      downloadFile(filePath,fileName);
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,{
          title: 'Storage Permission Required',
          message: 'Application needs access to your storage to download File',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile(filePath,fileName);
          console.log('Storage Permission Granted.');
        }else {
          console.log('Error','Storage Permission Not Granted');
        }
        // downloadFile(filePath,fileName);
      } catch (err) {
        console.log("++++"+err);
      }
    }
  };

  const downloadFile = (filePath,fileName) => {
    let FILE_URL = filePath;
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir+'/'+fileName,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,   
      },
    };
    config(options).fetch('GET', FILE_URL).then(res => {
      console.log('res -> ', JSON.stringify(res));
      alert('File Downloaded Successfully.');
    }).catch(err => {
      console.log("++++"+err);
    });
  };

  return (
    <View style={styles.container}>
      {assignment ? (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.dos}>DOS-{moment(assignment.submitbydate).format('MM/DD/YYYY hh:mm:ss A')}</Text>
            <Text style={styles.marks}>Marks - {assignment.marks}</Text>
          </View>
          <Text style={styles.subject}>{assignment.subject}</Text>
          <Text style={styles.instructions}>Instructions:</Text>
          <Text style={styles.assingmentbody}>{assignment.assingmentbody}</Text>
          {attachment.length > 0 &&
            attachment.map((item, index) => (
              <View key={index} style={styles.attachmentContainer}>
                <Text style={styles.fileName}>{item.fileName}</Text>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity onPress={() => handleIconPress(item.filepath,'download',item.fileName)}>
                    <Icon name="download" size={16} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleIconPress(item.filepath,'view',item.fileName)}>
                    <Icon name="eye" size={16} style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dos: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
    color:"#222222"
  },
  marks: {
    fontWeight: 'bold',
    fontSize: 16,
    color:"#222222"
  },
  subject: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color:"#222222"
  },
  instructions: {
    fontWeight: 'bold',
    fontSize: 16,
    color:"#222222"
  },
  assingmentbody: {
    fontSize: 16,
    marginBottom: 10,
    color:"#222222"
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  fileName: {
    fontSize: 16,
    marginRight: 10,
    color: '#233698',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#233698',
  },
});

export default AssignmentDetail;
