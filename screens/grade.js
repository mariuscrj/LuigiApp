import React from 'react'
import {
    StyleSheet,
    View,
    Text,
  } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS } from '../helpers/colors.js'
import Firebase from '../helpers/firebase'

export default class GradeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            grade : props.route.params.grade || null,
            course : props.route.params.course || null,
            teacher: null
        }
    }

    componentDidMount() {
        Firebase.getTeacherProfile(this.props.route.params.course.teacherId, teacher => {
            this.setState({
                teacher: teacher
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() =>  this.props.navigation.navigate('Grades')}
                    >
                        <Text style={styles.backButtonText}>Înapoi</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.gradeContainer}>
                    <Text style={styles.gradeText}>Disciplina: {this.state.course?.name}</Text>
                    <Text style={styles.gradeText}>Data examen: {this.state.course?.date}</Text>
                    <Text style={styles.gradeText}>Nota: {this.state.grade[0]?.value}</Text>
                    <Text style={styles.gradeText}>Data: {this.state.grade[0]?.data}</Text>
                    <Text style={styles.gradeText}>Nr. Credite: {this.state.course?.credits}</Text>
                    <Text style={styles.gradeText}>Profesor: { this.state.teacher?.lastName + ' ' + this.state.teacher?.firstName }</Text>
                    <Text style={styles.gradeText}>Email: { this.state.teacher?.email }</Text>
                </View>
                <View style={styles.menu}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() =>  this.props.navigation.navigate('ChatStudent', {courseId: this.state.course.courseId})}
                    >
                        <Text style={styles.backButtonText}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() =>  this.props.navigation.navigate('FilesStudent', {courseId: this.state.course.courseId})}
                    >
                        <Text style={styles.backButtonText}>Files</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ulbsBlue
    },

    gradeContainer: {
        marginTop: 20,     
        marginLeft: 12,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 4,
        borderStyle: 'solid',
    },
    
    gradeText: {
        borderTopColor: COLORS.backgroundColorButton,
        borderTopWidth: 4,
        borderStyle: 'solid',
        padding: 8,
        fontSize: 16,
        color: COLORS.white,
    },

    header: {
        marginTop: 20,
        marginLeft: 12,
        alignItems: "flex-start"
    },

    menu: {
        marginLeft: 12,
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
})