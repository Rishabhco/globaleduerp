import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import moment from 'moment';

const EventsHolidays = ({ data }) => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={require('../assets/calendar.png')} style={styles.calendarIcon} />
        <View style={styles.itemContent}>
          <Text style={styles.heading}>{item.remarks}</Text>
          <Text style={styles.dates}>
            {moment(item.startdate).format('MMM D, YYYY')} - {moment(item.enddate).format('MMM D, YYYY')}
          </Text>
        </View>
      </View>
    );
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={renderSeparator}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  calendarIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
  },
  dates: {
    fontSize: 14,
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default EventsHolidays;
