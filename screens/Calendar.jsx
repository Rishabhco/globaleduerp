import moment from 'moment';
import React,{useEffect,useState} from 'react';
import { View, Text, StyleSheet,BackHandler} from 'react-native';
import {getAllCalendarDetail,getCalendarDetailByDate} from '../services/calendar.services';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Calendars = ({navigation}) => {
    const [min,setMin]=useState(null);
    const [max,setMax]=useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(()=>{
        AsyncStorage.getItem('Profile').then((res)=>{
            setMin(moment(new Date(JSON.parse(res).sessionyearstartdate)).format('YYYY-MM-DD'));
            setMax(moment(new Date(JSON.parse(res).sessionyearenddate)).format('YYYY-MM-DD'));
        }).catch((err)=>{
            console.log("profile err:",err);
        });
        const date=new Date();
        const fromDate=moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('MM/DD/YY');
        const toDate=moment(new Date(date.getFullYear(), date.getMonth()+1, 0)).format('MM/DD/YY');
        getAllCalendarDetails(fromDate,toDate);
        const currentDate=moment(new Date(date.getFullYear(), date.getMonth(), date.getDate())).format('MM/DD/YY');
        setSelectedDate(moment(new Date(date.getFullYear(), date.getMonth(), date.getDate())).format('YYYY-MM-DD'));
        getCalendarDayDetails(currentDate);
        const handleBackPress = () => {
            navigation.goBack();
            return true;
          };
          BackHandler.addEventListener('hardwareBackPress', handleBackPress);
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          };
    },[]);

    const handleDayPress=(day)=>{
        const date=new Date(day.dateString);
        const currentDate=moment(new Date(date.getFullYear(), date.getMonth(), date.getDate())).format('MM/DD/YY');
        setSelectedDate(moment(new Date(date.getFullYear(), date.getMonth(), date.getDate())).format('YYYY-MM-DD'));
        getCalendarDayDetails(currentDate);
    }

    const getMonthChange=(month)=>{
        const date=new Date(month.dateString);
        const fromDate=moment(new Date(date.getFullYear(),date.getMonth(),1)).format('MM/DD/YY');
        const toDate=moment(new Date(date.getYear(),date.getMonth()+1,0)).format('MM/DD/YY');
        getAllCalendarDetails(fromDate, toDate);
    }

    const getAllCalendarDetails=(fromDate,toDate)=>{
        getAllCalendarDetail(fromDate,toDate).then((res)=>{
            console.log("all details res: ",res);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const getCalendarDayDetails=(currentDate)=>{
        getCalendarDetailByDate(currentDate,currentDate).then((res)=>{
            console.log("date details res:",res);
        }).catch((err)=>{
            console.log(err);
        });
    }

    return (
        <View style={styles.container}>
            <Calendar 
                maxDate={max} minDate={min} hideExtraDays 
                onMonthChange={(month)=>{getMonthChange(month)}}
                onDayPress={(day)=>{handleDayPress(day)}}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: '#233698' }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Calendars;