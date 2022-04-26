/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Component } from 'react';
import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import HomeTScreen from './screens/homeTeacher';
import StudentInfoScreen from './screens/studentInfo';
import TeacherInfoScreen from './screens/teacherInfo';
import HistoryScreen from './screens/history';
import PasswordScreen from './screens/password';
import GradesScreen from './screens/grades';
import GradeScreen from './screens/grade';
import CoursesScreen from './screens/courses';
import CourseScreen from './screens/course';
import ChatScreen from './screens/chatScreen';
import ChatStudentScreen from './screens/chatStudent';
import FilesScreen from './screens/files';
import FilesStudentScreen from './screens/fileStudent';
import AsyncStorage from '@react-native-async-storage/async-storage'

class App extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false
    this.state = ({
      isLogged: false,
      isStudent: false,
      isTeacher: false
    })
  }
  
  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.getData(this.state.isLogged);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('isLogged')
      if(value == 'trueStudent') {
        this._isMounted && this.setState({ 
          isLogged: true,
          isStudent: true,
        })
      } else if(value == 'trueTeacher') {
          this._isMounted && this.setState({ 
            isLogged: true,
            isTeacher: true,
          })
      } else{
        this._isMounted && this.setState({ 
          isTeacher: false,
          isStudent: false,
          isLogged: false 
        })
      }
    } catch(e) {
      console.log(e)
    }
  }

  render() {
    const Stack = createStackNavigator();
    this.getData();

    return (
      <NavigationContainer>
        <Stack.Navigator headerMode='none'>
          {this.state.isLogged ? (
          <>
            {this.state.isStudent ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="StudentInfo" component={StudentInfoScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Password" component={PasswordScreen} />
              <Stack.Screen name="Grades" component={GradesScreen} />
              <Stack.Screen name="Grade" component={GradeScreen} />
              <Stack.Screen name="ChatStudent" component={ChatStudentScreen} />
              <Stack.Screen name="FilesStudent" component={FilesStudentScreen} />
            </>
            ) : (
              <>
              <Stack.Screen name="HomeT" component={HomeTScreen} />
              <Stack.Screen name="TeacherInfo" component={TeacherInfoScreen} />
              <Stack.Screen name="Courses" component={CoursesScreen} />
              <Stack.Screen name="Course" component={CourseScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Files" component={FilesScreen} />
              </>
            )}
          </>
          ) : (
            <>
            <Stack.Screen name="Login" component={LoginScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;