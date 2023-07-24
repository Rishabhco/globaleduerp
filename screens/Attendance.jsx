import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,BackHandler} from 'react-native';
import { forkJoin } from 'rxjs';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStudentMonthlyAttendance, getStudentAttendanceSummary } from '../services/attendance.services';

const Attendance = ({navigation}) => {
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendance, setAttendance] = useState({});
    const [groupedDate, setGroupedDate] = useState({});
    const [summary, setSummary] = useState([]);
    const [attd, setAttd] = useState([]);
    const [hide, setHide] = useState(true);
    const [remark, setRemark] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('Profile').then((res) => {
            setMin(moment(new Date(JSON.parse(res).sessionyearstartdate)).format('YYYY-MM-DD'));
            setMax(moment(new Date(JSON.parse(res).sessionyearenddate)).format('YYYY-MM-DD'));
        }).catch((err) => {
            console.log("profile err:", err);
        });
        const date = new Date();
        const fromDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('MM/DD/YY');
        const toDate = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('MM/DD/YY');
        setSelectedDate(moment(new Date(date.getFullYear(), date.getMonth(), date.getDate())).format('YYYY-MM-DD'));
        getAttendance(fromDate, toDate);
        const handleBackPress = () => {
            navigation.goBack();
            return true;
          };
          BackHandler.addEventListener('hardwareBackPress', handleBackPress);
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          };
    }, []);

    const handleDayPress = (day) => {
        const date = new Date(day.dateString);
        const dateRemark = attd.find(x => new Date(x.attdate).toLocaleDateString() == date.toLocaleDateString())?.remarks;
        setRemark(dateRemark);
        setTimeout(() => {
            setHide(false);
        }, 1000);
        setHide(true);
        setSelectedDate(moment(new Date(date.getFullYear(), date.getMonth(), date.getDate())).format('YYYY-MM-DD'));
    }

    const getMonthChange = (month) => {
        const date = new Date(month.dateString);
        const fromDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('MM/DD/YY');
        const toDate = moment(new Date(date.getYear(), date.getMonth() + 1, 0)).format('MM/DD/YY');
        getAttendance(fromDate, toDate);
    }

    const getAttendance = async (fromDate, toDate) => {
        forkJoin([getStudentMonthlyAttendance(fromDate, toDate), getStudentAttendanceSummary(fromDate, toDate)]).subscribe(([attd, smry]) => {
            setAttd(attd);
            setSummary(smry);
            let config = {};
            for (const item of attd) {
                config[moment(new Date(item.attdate)).format('YYYY-MM-DD')] = { selected: true, selectedColor: item.color };
            }
            setAttendance(config);
            let groupedDate = attd.reduce(function (acc, obj) {
                var key = obj['daystatus_id'];
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(obj);
                return acc;
            }, {});
            setGroupedDate(groupedDate);
        });
    }

    return (
        <View style={styles.container}>
            <Calendar
                maxDate={max} minDate={min} hideExtraDays
                onMonthChange={(month) => { getMonthChange(month) }}
                onDayPress={(day) => { handleDayPress(day) }}
                markedDates={{
                    ...attendance,
                    [selectedDate]: { selected: true, selectedColor: '#233698' },
                }}
            />
            {hide && remark != null && <View style={styles.remarkContainer}>
                <Text style={styles.remarkText}>{remark}</Text>
            </View>}
            {Object.keys(groupedDate).length > 0 && (
                <View style={styles.labelContainer}>
                    {Object.keys(groupedDate).map((key) => (
                        <View key={key} style={styles.labelItem}>
                            <View style={[styles.colorIndicator, { backgroundColor: groupedDate[key][0].color }]} />
                            <Text style={styles.labelText}>{groupedDate[key][0].daystatus}</Text>
                        </View>
                    ))}
                </View>
            )}
            {summary.length > 0 && <View style={styles.summaryContainer}>
                {summary.map((item, index) => (
                    <View key={index} style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{item.lable}</Text>
                        <Text style={styles.summaryValue}>{item.value}</Text>
                    </View>
                ))}
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    remarkContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 20,
        paddingHorizontal: 20,
    },
    remarkText:{
        color: 'white', 
        backgroundColor: '#233698', 
        padding: 10, 
        borderRadius: 10
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    colorIndicator: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 7
    },
    labelText: {
        fontSize: 14,
        color: 'gray',
    },
    summaryContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: 'gray',
    },
    summaryValue: {
        flex: 1,
        fontSize: 16,
        textAlign: 'right',
        color: 'gray',
    },
});

export default Attendance;