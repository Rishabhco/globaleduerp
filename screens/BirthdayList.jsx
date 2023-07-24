import React, { useState, useEffect,Fragment } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image } from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { getBirthdayList } from '../services/birthdayList.services';
import { UserType } from '../constants/global.constant';

const BirthdayList = ({ name }) => {
  const [oldDate, setOldDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    checkBirthdays(date);
  }, []);

  const checkBirthdays = (selectedDate) => {
    if (selectedDate.toDateString() === oldDate.toDateString()) {
      return;
    }

    let userType;
    if (name === 'Staff') {
      userType = UserType.Employee;
    } else if (name === 'Students') {
      userType = UserType.Student;
    }

    const formattedDate = getFormattedDate(selectedDate);
    getBirthdayList(formattedDate, userType)
      .then((res) => {
        setBirthdays(res);
        setOldDate(selectedDate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFormattedDate = (date) => {
    if (!date) {
      return 'Invalid Date';
    } else {
      return moment(date).format('yyyy-MM-DD');
    }
  };

  const renderBirthdayItem = (item, index) => {
    if (name === 'Staff') {
      return (
        <View style={styles.itemContainer} key={index}>
          <View style={styles.imageContainer}>
            {item.imgurl ? (
              <Image source={{ uri: item.imgurl }} style={styles.itemImage} />
            ) : (
              <Image source={require('../assets/user1.jpg')} style={styles.itemImage} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>Name: {item.name}</Text>
            <Text style={styles.itemText}>Emp Code: {item.empCode}</Text>
            <Text style={styles.itemText}>Department Name: {item.departmentName}</Text>
            <Text style={styles.itemText}>DOB: {moment(item.dob).format('DD MMM')}</Text>
          </View>
        </View>
      );
    } else if (name === 'Students') {
      return (
        <View style={styles.itemContainer} key={index}>
          <View style={styles.imageContainer}>
            {item.imgurl ? (
              <Image source={{ uri: item.imgurl }} style={styles.itemImage} />
            ) : (
              <Image source={require('../assets/user1.jpg')} style={styles.itemImage} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>Name: {item.name}</Text>
            <Text style={styles.itemText}>Admission Number: {item.admissionnumber}</Text>
            <Text style={styles.itemText}>
              Class Name: {item.classname}, Section Name: {item.sectionname}
            </Text>
            <Text style={styles.itemText}>
              DOB: {moment(item.dob).format('DD MMM')}, Age: {item.age} Y
            </Text>
          </View>
        </View>
      );
    }
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardHeading}>Select Date</Text>
          <DatePicker
            modal
            mode="date"
            open={open}
            date={date}
            onConfirm={(selectedDate) => {
              setOpen(false);
              setDate(selectedDate);
              checkBirthdays(selectedDate);
            }}
            onCancel={() => setOpen(false)}
          />
        </View>
        <View style={styles.selectButtonContainer}>
          <Button title={moment(date).format('DD MMMM YYYY')} onPress={() => setOpen(true)} color="#233698" />
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {birthdays.length === 0 ? (
            <Text style={{color:'gray'}}>No data found</Text>
          ) : (
            birthdays.map((item, index) => (
              <Fragment key={index}>
                {index !== 0 && renderSeparator()}
                {renderBirthdayItem(item, index)}
              </Fragment>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#000000',
  },
  selectButtonContainer: {
    backgroundColor: '#233698',
    borderRadius: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  imageContainer: {
    marginRight: 10,
    borderWidth: 4,
    borderColor: '#233698',
    borderRadius: 50,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});

export default BirthdayList;
