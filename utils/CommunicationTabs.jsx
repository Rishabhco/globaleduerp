import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text,BackHandler} from 'react-native';
import { getCommType, getCommunication } from '../services/communication.services';
import Communication from '../screens/Communication';

const Tab = createMaterialTopTabNavigator();

function CommunicationTabs({navigation}) {
  const [commType, setCommType] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [filterComm, setFilterComm] = useState([]);
  const [selectedTabIcon, setSelectedTabIcon] = useState('');
  const [defaultSelectedTab, setDefaultSelectedTab] = useState('');

  useEffect(() => {
    getCommType().then((res) => {
      setCommType(res);
      if (res.length > 0) {
        setDefaultSelectedTab(res[0].commtypemaster_id);
        setSelectedTabIcon(res[0].name.charAt(0));
      }
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
  }, []);

  useEffect(() => {
  }, [commType]);

  useEffect(() => {
    if (commType.length > 0) {
      getMobileCommunication();
    }
  }, [defaultSelectedTab]);

  const getMobileCommunication = () => {
    getCommunication().then((response) => {
      setCommunications(response);
      const updatedCommTypes = commType.map((item) => ({ ...item, unread: 0 }));
      response.forEach((item) => {
        if (item.isread === 0) {
          const index = updatedCommTypes.findIndex((x) => x.commtypemaster_id === item.commtypemaster_id);
          if (index > -1) {
            updatedCommTypes[index].unread += 1;
          }
        }
      });
      setCommType(updatedCommTypes);
      setFilterComm(response.filter((x) => x.commtypemaster_id === defaultSelectedTab));
    }).catch((error) => {
      console.log(error);
    });
  };

  const onTabPress = (name) => {
    const selectedTab = name;
    const selectedTabIcon = commType.find((x) => x.name === selectedTab)?.name.charAt(0);
    setSelectedTabIcon(selectedTabIcon);
    const selectedTabId = commType.find((x) => x.name === selectedTab)?.commtypemaster_id;
    setDefaultSelectedTab(selectedTabId);
    setFilterComm(communications.filter((x) => x.commtypemaster_id === selectedTabId));
  };

  if (commType.length === 0) {
    return <Text>No communication types available.</Text>;
  }

  return (
    <Tab.Navigator screenOptions={{
      swipeEnabled: false,
    }}>
      {commType.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          listeners={({tabPress: () => onTabPress(item.name)})}

        >
          {() => <Communication filterComm={filterComm} tabIcon={selectedTabIcon} navigation={navigation} />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default CommunicationTabs;