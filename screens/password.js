import React, { Component, useState } from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {
    StyleSheet,
    View,
    Alert,
    Text,
    TextInput,
    ScrollView
  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../helpers/colors.js';
import auth from '@react-native-firebase/auth';

class PasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: null,
            passwordC: null,
        };
    }

    passwordHandler() {
        var user = auth().currentUser
        const newPass = this.state.password
        const newPassC = this.state.passwordC

        if((newPass == newPassC) && (newPass.length > 5)) {
            user.updatePassword(newPass).then(function() {
                Alert.alert(
                    "SUCCES",
                    "Parola a fost schimbată cu succes",
                    [
                      {
                        text: "Cancel",
                        style: "cancel"
                      },
                      { text: "OK" }
                    ]
                );
            }).catch(function(error) {
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
            });
        } else {
            Alert.alert(
                "Eroare",
                "Parola trebuie sa aiba minim 6 caractere",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  { text: "OK" }
                ]
            );
        }

        this.textInput1.clear()
        this.textInput2.clear()
    }

    
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                <TouchableOpacity
                        style={styles.backButton}
                        onPress={() =>  this.props.navigation.navigate('Home')}
                    >
                        <Text style={styles.backButtonText}>Înapoi</Text>
                    </TouchableOpacity> 
                </View>
                <ScrollView>
                    <Text style={styles.inputText}>Parola noua:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            underlineColorAndroid = "transparent"
                            placeholder="Your password"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={(newPass) => this.setState({password: newPass})}
                            ref={input1 => { this.textInput1 = input1}}
                        />
                    </View>
                    <Text style={styles.inputText}>Confirmare parola noua:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            underlineColorAndroid = "transparent"
                            placeholder="Your password"
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={(cPass) => this.setState({passwordC: cPass})}
                            ref={input2 => { this.textInput2 = input2}}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => this.passwordHandler()}
                    >
                        <Text style={styles.signInText}>Schimba Parola</Text>
                    </TouchableOpacity>  
                </ScrollView>
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
        alignItems: "flex-start"
    },


    backButton: {
        width: 80,
        height: 40,
        margin: 12,
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

    signIn: {
        height: 40,
        margin: 15,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 1,
        backgroundColor: COLORS.backgroundColorButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    signInText: {
        color: COLORS.white,
    }
})

export default PasswordScreen;