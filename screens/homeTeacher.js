import React from 'react'
import { launchImageLibrary } from 'react-native-image-picker'
import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView
  } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { COLORS } from '../helpers/colors.js'

import Firebase from '../helpers/firebase'
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage'

const settings = require('../images/settings.png')

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profileImage: null,
            teacher: null,
            domainId: null,
            image: null,
            profileImage: null,
        }
    }

    sendData = async (value) => {
        try {
          await AsyncStorage.setItem('isLogged', value)
        } catch (e) {
            console.log(e)
        }
    }

    componentDidMount() {
        var user = auth().currentUser;
        this.setState({
            profileImage: user?.photoURL
        })

        if(user != null) {
            Firebase.getTeacherProfile(user.uid, teacher => {
                this.setState({ 
                    teacher: teacher,
                })
            });
        }
    }

    logoutHandler = () => {
        this.sendData('false')
        auth()
        .signOut()
        .then(() => this.sendData('false'))
    }

    changeProfile = () => {
        const options = {
            quality: 0.7, 
            mediaType: 'photo', 
        };

        launchImageLibrary(options, response => {  
            if (response.didCancel) {
              console.log('User cancelled photo picker')
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton)
            } else {         
              let source = { uri: response.uri }
              this.uploadImage(source, response.fileName)
            }
        });
    }

    uploadImage = async (source, name) => {
        const task = storage()
          .ref(name)
          .putFile(source.uri);
        try {
          await task;
        } catch (e) {
          console.error(e);
        }

        const url = await storage().ref(name).getDownloadURL();
        var user = auth().currentUser;

        user.updateProfile({
            photoURL: url
        })

        this.setState({
            profileImage: user.photoURL
        })
    }

    render() {
        return (
            <View style={ styles.container }>
                <View style={ styles.header }>
                    <TouchableOpacity
                        style={ styles.signOut }
                        onPress={ this.logoutHandler }>
                        <Text style={ styles.signOutText }>Sign out</Text>
                    </TouchableOpacity>   
                </View>
                <ScrollView>
                    <View style={ styles.menu }>
                        <TouchableOpacity 
                            onPress={ this.changeProfile }
                            style={styles.imageContainer}>
                            <Image 
                                style={ styles.image } 
                                source={{ uri: this.state.profileImage }} />
                            <View style={ styles.overlay }>
                                <Image 
                                    style={ styles.overlayImage } 
                                    source={ settings } />
                            </View>
                        </TouchableOpacity>
                        <Text style={ styles.text }>Buna ziua, { this.state.teacher?.firstName } { this.state.teacher?.lastName }</Text>
                        <TouchableOpacity
                            style={ styles.menuItem }
                            onPress={ () => this.props.navigation.navigate('TeacherInfo', { teacher: this.state.teacher }) }>
                            <Text style={ styles.menuText }>Date personale</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ styles.menuItem }
                            onPress={ () => this.props.navigation.navigate('Courses', { teacher: this.state.teacher }) }>
                            <Text style={ styles.menuText }>Cursuri</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ulbsBlue,
    },
    header: {
        alignItems: "flex-end"
    },
    menu: {
        flex: 2
    },
    signOut: {
        width: 80,
        height: 40,
        margin: 15,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 1,
        backgroundColor: COLORS.backgroundColorButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signOutText: {
        color: COLORS.white,
    },
    imageContainer: {
        width: 150,
        height: 150,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: COLORS.backgroundColorButton,
        borderRadius: 100
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'stretch'
    },
    menu: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        marginTop: 10,
        marginBottom: 10,
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuItem: {
        width: 180,
        height: 40,
        margin: 15,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 1,
        backgroundColor: COLORS.backgroundColorButton,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuText: {
        color: COLORS.white,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.overlay,
        height: 30,
        opacity: 0.6
    },
    overlayImage: {
        width: 20,
        height: 20
    }
})