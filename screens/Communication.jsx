import React, { useEffect, useState, Fragment } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { UserTypeConstant } from '../constants/userType.constant';
import {getLoginDetails} from '../helper/auth.helper';

const CommunicationItem = ({ item, tabIcon, navigation }) => {
  const { commsubject, sentby, senddate } = item;
  const onPress = () => {navigation.navigate('CommunicationDetail', { id: item.commtosend_id });};
  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <Fragment>
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <View style={styles.iconContainer}>
          <Text style={styles.tabIcon}>{tabIcon}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{commsubject}</Text>
          <Text style={styles.sentBy}>Sent By: {sentby}</Text>
          <Text style={styles.sentDate}>Sent Date: {moment(senddate).format('MM/DD/YYYY hh:mm:ss A')}</Text>
        </View>
        <Icon name="angle-right" size={24} color="#233698" />
      </TouchableOpacity>
      {renderSeparator()}
    </Fragment>
  );
};

const Communication = ({ filterComm, tabIcon, navigation }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function getLoginDetail() {
      const loginDetails=await getLoginDetails();
      if (loginDetails.StuStaffTypeId == UserTypeConstant.Teacher) {
        setVisible(true);
      }
    };
    getLoginDetail();
  }, [filterComm]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContainer}>
        {filterComm.map((item, index) => (
          <Fragment key={index}>
            <CommunicationItem item={item} tabIcon={tabIcon} navigation={navigation} />
          </Fragment>
        ))}
      </ScrollView>
      {visible && (
        <TouchableOpacity style={styles.sendChatButton} onPress={() => navigation.navigate('Send Communication')}>
          <Icon name="comments" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  itemContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    backgroundColor: '#233698',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tabIcon: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    color: '#233698',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  sentBy: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 4,
  },
  sentDate: {
    color: '#222222',
    fontSize: 16,
  },
  sendChatButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#233698',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Communication;