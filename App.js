import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Focus } from './focus/Focus';
import { FocusHistory } from './focus/FocusHistory';
import { Timer } from './timer/Timer';
import { colors } from './utils/color'
import { spacing } from './utils/sizes';

const stats = {
  complete: 1,
  cancel: 2
}
export default function App(){
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistorySubjectWithStatus = (subject, status) => {
    setFocusHistory([...focusHistory, { key: String(focusHistory.length + 1), subject, status}])
  }
  const onClear = () => {
    setFocusHistory([]);
  }
  const saveForusHistory = async () => {
    try{
      AsyncStorage.setItem("focusHistory", JSON.stringify(focusHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try{
      const history = await AsyncStorage.getItem("focusHistory");
      if(history && JSON.parse(history).length){
        setFocusHistory( JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    loadFocusHistory(); 
  }, [])
  useEffect(() => {
    saveForusHistory();
  }, [focusHistory]);
  return(
    <View style={style.container}>
      {focusSubject ? (
        <Timer 
        focusSubject={focusSubject} 
        onTimerEnd={() => {
          addFocusHistorySubjectWithStatus(focusSubject, stats.complete);
          setFocusSubject(null);
        }}
        clearSubject={() => {
          addFocusHistorySubjectWithStatus(focusSubject, stats.cancel);
          setFocusSubject(null);
        }}
         />
      ) : (
        <View style={{ flex: 0.5 }}>
          <Focus addSubject={setFocusSubject}/>
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? spacing.xxl : spacing.lg,
    backgroundColor: colors.darkBlue,
  }
});