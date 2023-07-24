import React, { useEffect, useState,Fragment} from 'react';
import { View, Text, StyleSheet, ScrollView,BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { dayConstant } from '../constants/day.constant';
import { UserTypeConstant } from '../constants/userType.constant';
import { getStudentTimeTable, getTeacherTimeTable } from '../services/timeTable.services';
import {getLoginDetails} from '../helper/auth.helper';

const TimeTable = ({navigation}) => {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [dayId, setDayId] = useState(dayConstant.Monday);
  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 7, name: 'Sunday' },
  ];

  useEffect(async() => {
    const loginDetails=await getLoginDetails();
        if (loginDetails.StuStaffTypeId == UserTypeConstant.Student) {
          getStudentTimeTable()
            .then((res) => {
              setData(res);
              setFilterData(res.filter((item) => item.dayid == dayId));
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (loginDetails.StuStaffTypeId == UserTypeConstant.Teacher) {
          getTeacherTimeTable()
            .then((res) => {
              setData(res);
              setFilterData(res.filter((item) => item.dayid == dayId));
            })
            .catch((err) => {
              console.log(err);
            });
        }
        const handleBackPress = () => {
          navigation.goBack();
          return true;
        };
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
  }, []);

  const handleDayChange = (selectedDayId) => {
    setDayId(selectedDayId);
    setFilterData(data.filter((item) => item.dayid == selectedDayId));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeading}>Select Day:</Text>
          <Picker
            selectedValue={dayId}
            style={styles.dropdown}
            onValueChange={(itemValue) => handleDayChange(itemValue)}
          >
            {days.map((day) => (
              <Picker.Item key={day.id} label={day.name} value={day.id} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.cardContainer}>
        {filterData.map((item, index) => (
          <Fragment key={item.name}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemTextHeading}>Period: {item.name}</Text>
              <Text style={styles.itemText}>Class: {item.class_name}</Text>
              <Text style={styles.itemText}>Section: {item.section_name}</Text>
              <Text style={styles.itemText}>Course: {item.course_name}</Text>
            </View>
            {index !== filterData.length - 1 && <View style={styles.separator} />}
          </Fragment>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 14,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  dropdown: {
    width: 200,
    fontSize: 18,
    fontWeight: 'normal',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemTextHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'gray',
  },
});

export default TimeTable;
