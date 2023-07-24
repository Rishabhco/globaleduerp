import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated,ScrollView,BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getMarks} from "../services/marks.services"

const Marks = ({navigation}) => {
    const [marks,setMarks] = useState([]);

    function groupBy(collection, property) {
        if (!collection) return null;
        const groupedCollection = collection.reduce((previous, current) => {
            const key = current[property];
            if (!previous[key]) {
                previous[key] = [current];
            } else {
                previous[key].push(current);
            }
            return previous;
        }, {});
        return Object.keys(groupedCollection).map((key) => ({key,value: groupedCollection[key],}));
    }

    useEffect(()=>{
        getMarks().then((res)=>{
            const transformedResult = groupBy(res, 'examname').sort().reverse();
            const initialMarksState = transformedResult.map((item) => ({
                key: item.key,
                value: item.value,
                isSelected: false,
                slideAnimation: new Animated.Value(0),
            }));
            setMarks(initialMarksState);
        }).catch((err)=>{
            console.log(err);
        })
        const handleBackPress = () => {
            navigation.goBack();
            return true;
          }
          BackHandler.addEventListener('hardwareBackPress', handleBackPress);
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          }
    },[]);

    const toggleCard = (key) => {
        const updatedMarks = marks.map((item) => {
            if (item.key === key) return { ...item, isSelected: !item.isSelected };
            return item;
        });
        setMarks(updatedMarks);
        const selectedCard = updatedMarks.find((item) => item.key === key);
        Animated.timing(selectedCard.slideAnimation, {
            toValue: selectedCard.isSelected ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const calculateContentHeight = (item) => {
        const tableRowHeight = 35;
        const tableHeaderHeight = 30;
        const maxHeight = tableHeaderHeight + tableRowHeight * item.value.length;
        return item.slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, maxHeight],
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        {marks.map((item) => (
            <View key={item.key}>
                <TouchableOpacity style={styles.cardHeader}  onPress={() => toggleCard(item.key)}  >
                    <View style={styles.headerLeft}>
                        <Text style={styles.cardHeaderText}>{item.key}</Text>
                    </View>
                    <Animated.View style={[ styles.headerRight,{ 
                        transform: [{rotate: item.slideAnimation.interpolate({inputRange: [0, 1],outputRange: ['0deg', '180deg'],})}],
                    }]}>
                        <Icon name="caret-down" size={18} color="#fff" />
                    </Animated.View>
                </TouchableOpacity>
                <View style={styles.cardContainer}>
                    <Animated.View style={[styles.cardContent,{
                        height: calculateContentHeight(item),
                    },]} >
                    {item.isSelected && (
                        <View>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Course Name</Text>
                                <Text style={[styles.tableHeaderText,styles.centerText]}>Total Marks</Text>
                                <Text style={[styles.tableHeaderText,styles.centerText]}>Secured</Text>
                            </View>
                            {item.value.map((course) => (
                                <View style={styles.tableRow} key={course.coursename}>
                                    <Text style={styles.tableCell}>{course.coursename}</Text>
                                    <Text style={[styles.tableCell,styles.centerText]}>{course.maxmarks}</Text>
                                    <Text style={[styles.tableCell,styles.centerText]}>{course.markobtain}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    </Animated.View>
                </View>
            </View>
        ))}
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#233698',
    padding: 10,
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    marginLeft: 10,
  },
  cardHeaderText: {
    fontSize: 16,
    color: '#fff',
  },
  cardContainer: {
    position: 'relative',
  },
  cardContent: {
    backgroundColor: '#f0f0f0',
    paddingLeft: 20,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  centerText: {
    textAlign: 'center',
    },
});

export default Marks;
