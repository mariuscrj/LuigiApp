import React, { Component, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Alert,
    Image,
  } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../helpers/colors.js';
import Firebase from '../helpers/firebase';
import auth from '@react-native-firebase/auth';

class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            courseId: props.route.params.courseId || null,
            toSend: '',
            chatMessages: null,
        })
    }

    componentDidMount() {
        const idC = this.state.courseId
        Firebase.getMessages(idC,  response => {
            this.setState({
                chatMessages: response
            })
        })
    }

    createChatHandler() {
        Firebase.chatCreate(this.state.courseId, response => { 
            if(response == true) {
                Alert.alert(
                    "SUCCES",
                    "Chat creat",
                    [
                      { text: "OK" }
                    ]
                );
            } else if(response == 'already') {
                Alert.alert(
                    "Eroare",
                    "Deja exista un chat",
                    [
                      { text: "OK" }
                    ]
                );
            }
        })
    }

    deleteChatHandler() {
        Firebase.chatDelete(this.state.courseId, response => { 
            if(response == true) {
                Alert.alert(
                    "SUCCES",
                    "Chat sters",
                    [
                      { text: "OK" }
                    ]
                );
            } else if(response == 'eroare') {
                Alert.alert(
                    "Eroare",
                    "Nu exista un chat",
                    [
                      { text: "OK" }
                    ]
                );
            }
        })
    }

    sendMessageHandler() {
        var user = auth().currentUser;
        var today = new Date()
        var h = String(today.getHours())
        var m = String(today.getMinutes())
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        const timestamp = h + ':' + m  + '-' + today

        Firebase.sendMessage(this.state.courseId, this.state.toSend, timestamp, user._user,  response => {
            this.textInput.clear()

            if(response == 'eroare') {
                Alert.alert(
                    "Eroare",
                    "Chat inexistent",
                    [
                      { text: "OK" }
                    ]
                );
            }
        })
    }

    render() {
        const messages = this.state.chatMessages

        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() =>  this.props.navigation.navigate('Course')}
                    >
                        <Text style={styles.backButtonText}>Înapoi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => this.createChatHandler()}
                    >
                        <Text style={styles.backButtonText}>Creaza chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => this.deleteChatHandler()}
                    >
                        <Text style={styles.backButtonText}>Delete chat</Text>
                    </TouchableOpacity>
                </View>
                <View>
                        <ScrollView ref={toS => { this.scrollInput = toS }} 
                            onContentSizeChange={() => this.scrollInput.scrollToEnd({animated: true})}
                            style={styles.scroll}
                        >
                            { 
                            messages != null ? messages?.map( (message) => {
                                if(message[1].user != undefined) {
                                    return(
                                        <View  key={message[0]}>
                                            <Text style={styles.timestamp}>{message[1].timestamp}</Text>
                                            <View style={styles.messageWrapper}>
                                                <View style={styles.messageContainer}>
                                                    <Image 
                                                        style={ styles.image } 
                                                        source={{ uri: message[1].user.photoURL}} 
                                                    />
                                                    <Text style={styles.messageText}>{message[1].user.email} :</Text>
                                                </View>
                                                <Text style={styles.messageT}>{message[1].text}</Text>     
                                            </View>
                                        </View>
                                    );         
                                }
                            }) 
                            :
                            <View><Text>Loading...</Text></View>
                        }
                        </ScrollView>
                </View>
                <View style={styles.inputContainer}>
                            <TextInput
                                underlineColorAndroid = "transparent"
                                placeholder="Type here"
                                placeholderTextColor="#fff"
                                style={styles.input}
                                autoCapitalize="none"
                                onChangeText={(toSend) => this.setState({toSend: toSend})}
                                ref={input => { this.textInput = input }}
                            />
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() => this.sendMessageHandler()}
                            >
                                <Text style={styles.menuText}>Trimite</Text>
                            </TouchableOpacity>
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
        alignItems: "flex-start",
        flexDirection: 'row'
    },

    menu: {
        flex: 2
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

    menuContent: {
        flexDirection: 'row',
        flexWrap: "wrap",
    },

    menuButton: {
        margin: 12,
        marginTop: 0,
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

    scroll: {
        margin: 15,
        marginTop: 8,
        padding: 10,
        paddingTop: 4,
        paddingBottom: 60,
        width: 340,
        height: 320,
        paddingBottom: 230,
        backgroundColor: COLORS.white,
    },

    messageWrapper: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: COLORS.message,
        borderRadius: 100,
    },

    messageContainer: {
        flexDirection: 'row',  
        alignItems: 'center',
        paddingLeft: 20
    },

    image: {
        width: 40,
        height: 40,
        borderRadius: 100
    },

    timestamp: {
        marginRight: 4
    },

    messageText: {
        marginLeft: 8,
    },

    messageT: {
        marginTop: 8,
        fontSize: 14,
        paddingLeft: 30
    },

    infoText: {
        padding: 12,
        color: COLORS.white,
        fontSize: 16,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 4,
        borderTopWidth: 0,
        borderStyle: 'solid',
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
        marginTop: 0,
        flex: 1,
        color: COLORS.white,
        height: 40,
        paddingLeft: 10
    },
})

export default ChatScreen;