import React, { Component, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../helpers/colors.js';
import Firebase from '../helpers/firebase'
import auth from '@react-native-firebase/auth';

class CoursesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            courses: null,
        })
    }

    componentDidMount() {
        var user = auth().currentUser;

        if(user != null) {
            Firebase.getTeacherCourses(user?.uid, courses => {
                this.setState({ 
                    courses: courses,
                })
            })
        }
    }

    courseHandler(course) {
        const navigation = this.props.navigation
        Firebase.getStudentsByCourse(course.domainId, students => {
            navigation.navigate('Course', {students: students, courseId: course.courseId})
        })
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() =>  this.props.navigation.navigate('HomeT')}
                    >
                        <Text style={styles.backButtonText}>Înapoi</Text>
                    </TouchableOpacity>
                    <View style={styles.menuContent}>
                        { this.state.courses?.map( (item) => {
                            return(
                            <TouchableOpacity
                                style={(this.state.infoType != 'general') ? styles.menuButton : styles.selectedButton}
                                key={ item.name }
                                onPress={() => this.courseHandler(item)}
                            >
                                <Text style={styles.menuText}>{ item.name }</Text>
                            </TouchableOpacity>
                            )
                        })}
                    </View> 
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ulbsBlue
    },

    header: {
        marginTop: 20,
        marginLeft: 12,
        alignItems: "flex-start"
    },

    menu: {
        flex: 2
    },

    text: {
        color: COLORS.white
    },

    backButton: {
        width: 80,
        height: 40,
        margin: 12,
        marginLeft: 0,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 1,
        backgroundColor: COLORS.backgroundColorButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    backButtonText: {
        color: COLORS.white,
    },

    menuContent: {
        flexDirection: 'row',
        flexWrap: "wrap",
    },

    menuButton: {
        margin: 12,
        marginTop: 20,
        marginLeft: 0,
        padding: 10,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 1,
        backgroundColor: COLORS.backgroundColorButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    selectedButton: {
        margin: 12,
        marginTop: 20,
        padding: 10,
        borderColor: COLORS.selectedButton,
        borderWidth: 1,
        backgroundColor: COLORS.selectedButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    menuText: {
        color: COLORS.white,
        fontSize: 14,
    },
    dropdown_4: {
        width: 150,
        marginTop: 12,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: 'white',
    },

    dropdown_4_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 14,
        color: COLORS.black,
        textAlign: 'center',
        textAlignVertical: 'center',
      },

    dropdown_4_dropdown: {
        width: 150,
        height: 150,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
    },
})

export default CoursesScreen;