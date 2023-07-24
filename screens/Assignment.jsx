import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList,BackHandler } from 'react-native';
import { getAssignments } from '../services/assignment.services';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

const Item = ({ title, course, marks, assingDate, dueDate, onPress }) => {
    const formattedAssingDate = moment(assingDate).format('MMM D, YYYY');
    return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.header}>
          <Text style={styles.course}>{course}</Text>
          <Text style={styles.marks}>Marks {marks}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Assignment Date:</Text>
          <Text style={styles.dateValue}>{formattedAssingDate}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Due Date:</Text>
          <Text style={styles.dateValue}>{dueDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
);
};

const Assignment = ({navigation}) => {
    const [assignments, setAssignments] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        getAssignments().then((res) => {
            setAssignments(res);
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
    }, [assignments]);

    const handlePress = (id) => {
        setSelectedId(id);
        navigation.navigate('AssignmentDetail', { id: id });
    };

  return (
    <SafeAreaView style={styles.container}>
      {assignments.length > 0 ? (
        <FlatList
          data={assignments}
          renderItem={({ item }) => 
            <Item title={item.assingmentname} course={item.course} marks={item.marks} onPress={() => handlePress(item.commassingment_id)}
                assingDate={item.assingmentdate} dueDate={item.submitbydate} 
            />
          }
          keyExtractor={(item) => item.commassingment_id}
        />
      ) : (
        <Text>No Assignments</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      backgroundColor: '#fff',
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    course: {
      fontSize: 18,
      fontWeight: 'bold',
      color:"#000000"
    },
    marks: {
        fontSize: 18,
        fontWeight: 'bold',
        color:"#233698"
    },
    title: {
      fontSize: 16,
      marginBottom: 10,
      color:"#222222"
    },
    dateContainer: {
      flexDirection: 'row',
    },
    dateLabel: {
      fontWeight: 'bold',
      color:"#222222"
    },
    dateValue: {
      marginLeft: 5,
      color:"#222222"
    },
});

export default Assignment;
