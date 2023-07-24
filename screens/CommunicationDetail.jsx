import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Linking,PermissionsAndroid,Platform,BackHandler} from 'react-native';
import { getCommunicationDetail } from '../services/communication.services';
import moment from 'moment';
import { getFileName } from '../helper/utility.helper.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'rn-fetch-blob';
const MAX_FILENAME_LENGTH = 20;

const CommunicationDetail = ({ route ,navigation}) => {
  const [details, setDetails] = useState({});
  const [attachment, setAttachment] = useState([]);

  useEffect(() => {
    getCommunicationDetail(route.params.id).then((res) => {
        console.log(res);
        const attachments = res.attachments ? res.attachments.split(',') : [];
        const filenames = res.file_name ? res.file_name.split(',') : [];
        console.log(attachments);
        console.log(filenames);
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
        setDetails(res);
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

  const getShortenedFileName = (fileName) => {
    if (fileName.length > MAX_FILENAME_LENGTH) {
      const shortenedName = fileName.substring(0, MAX_FILENAME_LENGTH - 3) + '...';
      return shortenedName;
    }
    return fileName;
  };

  return (
    <View style={styles.container}>
      {details ? (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.heading}>{details.commsubject}</Text>
          </View>
            <Text style={styles.sentby}>By: {details.sentby}</Text>
            <Text style={styles.sentdate}>Sent Date: {moment(details.senddate).format('MM/DD/YYYY hh:mm:ss A')}</Text>
          <Text style={styles.commbody}>{details.mailsmsbody}</Text>
          {attachment.length > 0 &&
            attachment.map((item, index) => (
              <View key={index} style={styles.attachmentContainer}>
                <Text style={styles.fileName}>{getShortenedFileName(item.fileName)}</Text>
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
    sentdate: {
      fontSize: 16,
      color: '#000000',
      marginBottom: 10,
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 20,
      color: '#233698',
      marginBottom: 10,
    },
    sentby: {
      fontSize: 16,
      color: '#000000',
      marginBottom: 5,
    },
    commbody: {
        color:"#222222",
        fontSize: 16,
        marginBottom: 10,
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
      maxWidth: '70%',
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
  

export default CommunicationDetail;
