import React, { Component, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    ScrollView,
    Linking
  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../helpers/colors.js';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import Firebase from '../helpers/firebase'

class FilesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseId: props.route.params.courseId || null,
            files: null,
        }
    }

    componentDidMount() {
        Firebase.getFileByCourse(this.state.courseId, response => {
            this.setState({
                files: response
            })
        })
    }

    uploadFile = async () => {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.images],
            });
            const task = storage()
            .ref(res.name)
            .putFile(res.uri);
            try {
                await task;
            } catch (e) {
                console.error(e);
            }
    
            const url = await storage().ref(res.name).getDownloadURL();
            Firebase.addFileToCourse(this.state.courseId, url, res.name, response => {
                if(response == true) {
                    Alert.alert(
                        "SUCCES",
                        "Fisier incarcat",
                        [
                          { text: "OK" }
                        ]
                    );
                }
            })
        } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            console.log('cancel')
        } else {
            throw err;
        }
        }
    }

    linkHandler(url) {
        Linking.openURL(url)
    }

    render() {
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
                        onPress={() =>  this.uploadFile()}
                    >
                        <Text style={styles.backButtonText}>Upload file</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    { this.state.files?.map( (item) => {
                            return(
                            <TouchableOpacity
                                style={styles.menuButton}
                                key={ item.url }
                                onPress={() => this.linkHandler(item.url)}
                            >
                                <Text style={styles.menuText}>{ item.name }</Text>
                            </TouchableOpacity>
                            )
                    })}
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
        marginTop: 20,
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

    infoContainer: {
        margin: 15,
        paddingBottom: 230,
        borderColor: COLORS.backgroundColorButton,
        borderTopWidth: 4,
        borderStyle: 'solid',
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
})

export default FilesScreen;