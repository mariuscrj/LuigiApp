import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Alert,
    TextInput
  } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS } from '../helpers/colors.js'
import Firebase from '../helpers/firebase'

export default class CourseScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            students: props.route.params.students || null,
            courseId: props.route.params.courseId || null,
            nota: null,
            grade: null,
            toSearch: '',
            isSearch: false,
            searchStudent: null,
        }
    }

    componentDidMount() {
        const idCourse = this.state.courseId

        Firebase.getAllGrade(idCourse, grade => {
            this.setState({ grade: grade })
        })      
    }

    setGradeHandler(idStudent) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        Firebase.setGrade(idStudent, this.state.courseId, this.state.nota, today, response => {
            if(response) {
                this.textInput.clear()
                Alert.alert(
                    "SUCCES",
                    "Nota a fost trimisă",
                    [
                      {
                        text: "Cancel",
                        style: "cancel"
                      },
                      { text: "OK" }
                    ]
                );
            } else {
                Alert.alert(
                    "Eroare",
                    "Ceva nu a mers bine",
                    [
                      {
                        text: "Cancel",
                        style: "cancel"
                      },
                      { text: "OK" }
                    ]
                );
            }
        })
    }

    searchHandler() {
        const toSearch = this.state.toSearch
        const temp = this.state.students.map((student) => {
            if(student.lastName.includes(toSearch)) {
                return {
                    idStudent: student.idStudent,
                    lastName: student.lastName,
                    firstName: student.firstName,
                    email: student.email,
                }
            } else if(student.email.includes(toSearch)) {
                return {
                    idStudent: student.idStudent,
                    lastName: student.lastName,
                    firstName: student.firstName,
                    email: student.email,
                }
            }
        }).filter(student => student != undefined) || []

        if(temp == null) {
            Alert.alert(
                "404",
                "Studentul nu a fost gasit",
                [
                  { text: "OK" }
                ]
            );
        } else {
            this.setState({
                searchStudent: temp,
                isSearch: true
            })
        }
    }

    render() {
        const students = this.state.students
        const grade = this.state.grade


            return (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() =>  this.props.navigation.navigate('Courses')}
                        >
                            <Text style={styles.backButtonText}>Înapoi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() =>  this.props.navigation.navigate('Chat', {courseId: this.state.courseId})}
                        >
                            <Text style={styles.backButtonText}>Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() =>  this.props.navigation.navigate('Files', {courseId: this.state.courseId})}
                        >
                            <Text style={styles.backButtonText}>Files</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            underlineColorAndroid = "transparent"
                            placeholder="Numele de familie al studentului"
                            placeholderTextColor="#fff"
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={(toSearch) => this.setState({toSearch: toSearch})}
                            ref={input => { this.textInput = input }}
                        />
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => this.searchHandler()}
                        >
                            <Text style={styles.menuText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.isSearch == false?
                    <ScrollView>
                        { students?.map( (item) => {
                            return(
                                <View key= {item.email} style={styles.gradeContainer}>
                                    <Text style={styles.gradeText}>Nume: {item.lastName} {item.firstName}</Text>
                                    <Text style={styles.gradeText}>Email: {item.email}</Text>
                                    { grade?.map((element) => {
                                        if(element.studentId == item.idStudent) {
                                            return(
                                                <View key = {element.data}>
                                                    <Text style={styles.gradeText}>Nota: {element.value} </Text>
                                                    <Text style={styles.gradeText}>Data: {element.data} </Text>
                                                </View>
                                            )
                                        }
                                    })}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            underlineColorAndroid = "transparent"
                                            placeholder="Nota dorita"
                                            placeholderTextColor="#fff"
                                            style={styles.input}
                                            autoCapitalize="none"
                                            onChangeText={(nota) => this.setState({nota: nota})}
                                            ref={input => { this.textInput = input }}
                                        />
                                        <TouchableOpacity
                                            style={styles.menuButton}
                                            onPress={() => this.setGradeHandler(item.idStudent)}
                                        >
                                            <Text style={styles.menuText}>Trimite</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                    :
                    <ScrollView>
                        { this.state.searchStudent?.map( (item) => {
                            return(
                                <View key= {item.email} style={styles.gradeContainer}>
                                    <Text style={styles.gradeText}>Nume: {item.lastName} {item.firstName}</Text>
                                    <Text style={styles.gradeText}>Email: {item.email}</Text>
                                    { grade?.map((element) => {
                                        if(element.studentId == item.idStudent) {
                                            return(
                                                <View key = {element.data}>
                                                    <Text style={styles.gradeText}>Nota: {element.value} </Text>
                                                    <Text style={styles.gradeText}>Data: {element.data} </Text>
                                                </View>
                                            )
                                        }
                                    })}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            underlineColorAndroid = "transparent"
                                            placeholder="Nota dorita"
                                            placeholderTextColor="#fff"
                                            style={styles.input}
                                            autoCapitalize="none"
                                            onChangeText={(nota) => this.setState({nota: nota})}
                                            ref={input => { this.textInput = input }}
                                        />
                                        <TouchableOpacity
                                            style={styles.menuButton}
                                            onPress={() => this.setGradeHandler(item.idStudent)}
                                        >
                                            <Text style={styles.menuText}>Trimite</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                    }
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
        padding: 8,
        fontSize: 16,
        color: COLORS.white,
    },

    header: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 12,
        alignItems: "flex-start"
    },

    menu: {
        flex: 2
    },

    menuButton: {
        marginRight: 10,
        padding: 10,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 1,
        backgroundColor: COLORS.backgroundColorButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    menuText: {
        color: COLORS.white,
        fontSize: 14,
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

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    input: {
        borderColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 8,
        margin: 10,
        flex: 1,
        color: COLORS.white,
        height: 40,
        paddingLeft: 10
    },
})