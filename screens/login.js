import React, { Component, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TextInput
  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../helpers/colors.js';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Firebase from '../helpers/firebase'

const logo = require('../images/ulbs.png');

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorStatus: false,
        };
    }

    sendData = async (value) => {
        try {
          await AsyncStorage.setItem('isLogged', value)
        } catch (e) {
            console.log(e)
        }
    }

    loginHandler() {
        const email = this.state.email;
        const pass = this.state.password;

        if(email && pass) {
            auth()
            .signInWithEmailAndPassword(email, pass)
            .then((data) => {
                this.setState({
                    errorStatus: false
                });
    
                if(data.user != null) {
                    Firebase.getStudentProfile(data.user.uid, student => {
                        if(student != null) {
                          this.sendData('trueStudent')
                          return
                        } else {
                            this.setState({
                                errorStatus: true
                            });
                        }
                    });
                }
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    errorStatus: true
                });
            });
        }
    }

    loginTeacherHandler() {
        const email = this.state.email;
        const pass = this.state.password;

        if(email && pass) {
            auth()
            .signInWithEmailAndPassword(email, pass)
            .then((data) => {
                this.setState({
                    errorStatus: false
                });
    
                if(data.user != null) {
                    Firebase.getTeacherProfile(data.user.uid, teacher => {
                        if(teacher != null) {
                           this.sendData('trueTeacher')
                           return
                        } else { 
                            this.setState({
                                errorStatus: true
                            });
                        }
                    });
                }
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    errorStatus: true
                });
            });
        }
    }

    render() { 
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image 
                        style={ styles.logo } 
                        source={logo} 
                        resizeMode="stretch"
                    />
                </View>
                <View style={styles.footer}>
                    <Text style={styles.title}>Sign In</Text>
                    <Text style={styles.inputText}>User:</Text>
                    <View style={styles.inputContainer}>
                        <FontAwesome 
                            name="user-o" 
                            size={20} 
                            color="#fff" 
                        />
                        <TextInput
                            underlineColorAndroid = "transparent"
                            placeholder="EMAIL"
                            placeholderTextColor="#fff"
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={(email) => this.setState({email: email})}
                        />
                    </View>
                    <Text style={styles.inputText}>Password:</Text>
                    <View style={styles.inputContainer}>
                        <FontAwesome 
                            name="lock" 
                            size={20} 
                            color="#fff" 
                        />
                        <TextInput
                            underlineColorAndroid = "transparent"
                            placeholder="Your password"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={(textPass) => this.setState({password: textPass})}
                        />
                    </View>
                    {
                        this.state.errorStatus ? <Text style={styles.errorText}>Check the fields again</Text> : null
                    }
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => this.loginHandler()}
                    >
                        <Text style={styles.changeText}>Sign in as Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => this.loginTeacherHandler()}
                    >
                        <Text style={styles.changeText}>Sign in as Teacher</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },

    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    footer: {
        flex: 2,
        backgroundColor: COLORS.ulbsBlue,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },

    logo: {
        width: 350,
        height: 197
    },

    title: {
        marginTop: 40,
        marginBottom: 40,
        color: COLORS.white,
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    inputContainer: {
        flexDirection: 'row',
        borderColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 8,
        margin: 15,
        padding: 6,
        alignItems: 'center'
    },

    inputText: {
        marginLeft: 15,
        color: COLORS.white,
        fontSize: 18
    },
    
    input: {
        flex: 1,
        color: COLORS.white,
        height: 40,
        paddingLeft: 10
    },

    errorText: {
        marginLeft: 15,
        color: COLORS.error,
        fontSize: 18,
        textAlign: 'center',
    },

    changeButton: {
        height: 40,
        margin: 15,
        marginTop: 5,
        marginBottom: 5,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 1,
        backgroundColor: COLORS.backgroundColorButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    changeText: {
        color: COLORS.white,
    }
})

export default LoginScreen;