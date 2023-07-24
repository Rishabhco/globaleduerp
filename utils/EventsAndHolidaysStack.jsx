import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EventsHolidays from '../screens/EventsHolidays';
import { useEffect ,useState} from 'react';
import { BackHandler } from 'react-native';
import { SysMaster,UserTypeIdConstant } from '../constants/global.constant';
import {getLoginDetails} from '../helper/auth.helper';
import { getEmpHolidayList, getStuHolidayList } from '../services/eventHolidays.services';

const Tab = createMaterialTopTabNavigator();

function EventsAndHolidaysStack({navigation}) {

  const [holidaysData, setHolidaysData] = useState([]);
  const [eventsData, setEventsData] = useState([]);


  useEffect(() => {
    async function getLoginDetail(){
      const res=await getLoginDetails();
      if(Number.parseInt(res.StuStaffTypeId)== UserTypeIdConstant.Student){
        getStuHolidayList().then((response)=>{
          setHolidaysData(response.filter((x) => x.calendartype_id === SysMaster.Holiday));
          setEventsData(response.filter((x) => x.calendartype_id === SysMaster.Event));
        }).catch((err)=>{
          console.log(err);
        });
      }
      if(Number.parseInt(res.StuStaffTypeId)== UserTypeIdConstant.Teacher){
        getEmpHolidayList().then((response)=>{
          setHolidaysData(response.filter((x) => x.calendartype_id === SysMaster.Holiday));
          setEventsData(response.filter((x) => x.calendartype_id === SysMaster.Event));
        }).catch((err)=>{
          console.log(err);
        });
      }
    }
    getLoginDetail();
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Holidays">{() => <EventsHolidays data={holidaysData} />}</Tab.Screen>
      <Tab.Screen name="Events" >{() => <EventsHolidays data={eventsData} />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export default EventsAndHolidaysStack;