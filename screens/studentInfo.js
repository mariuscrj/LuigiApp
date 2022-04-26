import React, { Component, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList
  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../helpers/colors.js';

class StudentInfoScreen extends Component {
    constructor(props) {
        super(props);
        const student = props.route.params.student || null

        this.state = {
            infoType: false,
            generalEl: [
                { key: 'Nume', text: student?.lastName || '' },
                { key: 'Prenume', text: student?.firstName || '' },
                { key: 'Nume dupa casatorie', text: student?.marriageName || ''},
                { key: 'Data nastere', text: student?.birthDate || '' },
                { key: 'Tara nastere', text: student?.birthCountry || '' },
                { key: 'Judet nastere', text: student?.birthRegion || '' },
                { key: 'Localitate nastere', text: student?.birthCity || ''},
                { key: 'Sex', text: student?.sex || '' },
                { key: 'Religie', text: student?.religion || '' },
                { key: 'Mediu', text: student?.environment || '' },
                { key: 'Minoritar', text: student?.minority || '' },
                { key: 'Cetatenie', text: student?.citizenship || '' },
                { key: 'Nationalitate', text: student?.nationality || '' },
                { key: 'CNP', text: student?.cnp || '' },
                { key: 'Serie BI/CI', text: student?.series || '' },
                { key: 'Stare civila', text: student?.maritalStatus || '' },
                { key: 'Situatie militara', text: student?.militaryStatus || '' },
            ],

            schoolEl: [
                { key: 'Categorii studii', text: student?.studyCategory || '' },
                { key: 'An Absolvire Liceu', text: student?.graduateYear || '' },
                { key: 'Medie bacalaureat', text: student?.bacalaureat || ''},
                { key: 'Olimpic', text: student?.performance || '' },
                { key: 'Provenienta', text: student?.provenance || '' },
                { key: 'Sesiune admitere', text: student?.dataAdmittance || '' },
                { key: 'Promotie', text: student?.promotion || ''},
                { key: 'Tip studii', text: student?.studyType || '' },
                { key: 'Facultate', text: student?.faculty || '' },
                { key: 'Profil', text: student?.domain || '' },
                { key: 'Specializare', text: student?.speciality || '' },
                { key: 'FI', text: student?.fi || '' },
                { key: 'Grupa', text: student?.group || ''},
                { key: 'Nr MATRICOL', text: student?.matricolNr || '' },
                { key: 'Tip loc', text: student?.type || '' },
                { key: 'Status curent', text: student?.currentStatus || '' },
            ],

            parentsEl: [
                { key: 'Prenume Tata', text: student?.fatherName || '' },
                { key: 'Prenume Mama', text: student?.motherName || '' },
            ],

            contactEl: [
                { key: 'Adresa', text: student?.address || '' },
                { key: 'Localitate', text: student?.city || '' },
                { key: 'Judet', text: student?.region || '' },
                { key: 'Tara', text: student?.country || '' },
                { key: 'E-mail', text: student?.email || '' },
            ],
        };
    }

    chooseHandler(btnID) {
        this.setState({infoType: btnID})
    }

    displayInfo() {
        const infoType = this.state.infoType;

        switch(infoType) {
            case 'general':
                return(
                    <View style={styles.infoContainer}>
                        <FlatList
                            style={styles.listContainer}
                            data={this.state.generalEl}
                            renderItem={
                                ({item}) => (
                                    <Text style={styles.infoText}>{item.key}: {item.text}</Text>
                                )
                            }
                        />
                    </View>
                );
            
            case 'school':
                return(
                    <View style={styles.infoContainer}>
                        <FlatList
                            style={styles.listContainer}
                            data={this.state.schoolEl}
                            renderItem={
                                ({item}) => (
                                    <Text style={styles.infoText}>{item.key}: {item.text}</Text>
                                )
                            }
                        />
                    </View>
                );
       
            case 'parents':
                return(
                    <View style={styles.infoContainer}>
                        <FlatList
                            style={styles.listContainer}
                            data={this.state.parentsEl}
                            renderItem={
                                ({item}) => (
                                    <Text style={styles.infoText}>{item.key}: {item.text}</Text>
                                )
                            }
                        />
                    </View>
                );
       
            case 'contact':
                return(
                    <View style={styles.infoContainer}>
                        <FlatList
                            style={styles.listContainer}
                            data={this.state.contactEl}
                            renderItem={
                                ({item}) => (
                                    <Text style={styles.infoText}>{item.key}: {item.text}</Text>
                                )
                            }
                        />
                    </View>
                );
        }      
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
                    <View style={styles.menuContent}>
                        <TouchableOpacity
                            style={(this.state.infoType != 'general') ? styles.menuButton : styles.selectedButton}
                            onPress={() => this.chooseHandler('general')}>
                            <Text style={styles.menuText}>Date Generale</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={(this.state.infoType != 'school') ? styles.menuButton : styles.selectedButton}
                            onPress={() => this.chooseHandler('school')}>
                            <Text style={styles.menuText}>Școlaritate</Text>
                        </TouchableOpacity>  
                        <TouchableOpacity
                            style={(this.state.infoType != 'parents') ? styles.menuButton : styles.selectedButton}
                            onPress={() => this.chooseHandler('parents')}>
                            <Text style={styles.menuText}>Parinți</Text>
                        </TouchableOpacity>  
                        <TouchableOpacity
                            style={(this.state.infoType != 'contact') ? styles.menuButton : styles.selectedButton}
                            onPress={() => this.chooseHandler('contact')}>
                            <Text style={styles.menuText}>Contact</Text>
                        </TouchableOpacity>  
                    </View> 
                </View>
                <View>
                    { this.displayInfo()}
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
        alignItems: "flex-start"
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

export default StudentInfoScreen;