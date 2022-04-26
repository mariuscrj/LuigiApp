import React, { Component, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../helpers/colors.js';

class HistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history : props.route.params.history,
        };
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
                    <View style={styles.center}>
                    { this.state.history.map( (item) => {
                        return(
                            <View key={ item.year } style={styles.containerInfo}>
                            <View style={styles.row}>
                                <Text style={styles.text}>An Universitar:</Text>
                                <Text style={styles.text}>{ item.studyYear }</Text>
                            </View>
                            <View style={styles.row}>
                                    <Text style={styles.text}>An Studiu:</Text>
                                    <Text style={styles.text}>{ item.year }</Text>
                            </View>
                            <View style={styles.subRow}>
                                    <Text style={styles.periodText}>Semestru I</Text>
                                    <View style={styles.info}>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Media Ponderata: { item.average1 }</Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Media Aritmetica: { item.arithmetic1 }</Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Credite: {item.credits1 } </Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>NrPuncteCredit: {item.nrCredits1 }</Text>
                                        </View>
                                    </View>
                            </View>
                            <View style={styles.subRow}>
                                    <Text style={styles.periodText}>Semestru II</Text>
                                    <View style={styles.info}>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Media Ponderata: { item.average2 }</Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Media Aritmetica: { item.arithmetic2 }</Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Credite: {item.credits2 }</Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>NrPuncteCredit: {item.nrCredits2 }</Text>
                                        </View>
                                    </View>
                            </View>
                            <View style={styles.subRow}>
                                    <Text style={styles.periodText}>Anuala</Text>
                                    <View style={styles.info}>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Media Ponderata: { item.yearAverage }</Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Media Aritmetica: { item.yearArithmetic }</Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>Credite: {item.yearCredits }</Text>
                                        </View>
                                        <View style={styles.subRow}>
                                            <Text style={styles.text}>NrPuncteCredit: {item.yearNrCredits }</Text>
                                        </View>
                                    </View>
                            </View>
                        </View>
                        )}
                    )}
                    </View>            
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

    center: {
        alignItems: 'center',
        marginTop: 15,
    },

    backButtonText: {
        color: COLORS.white,
    },

    containerInfo: {
        width: 300,
        borderColor: COLORS.backgroundColorButton,
        borderWidth: 4,
        borderTopWidth: 0,
        borderStyle: 'solid',
    },

    row: {
        flexDirection: 'row',
        borderTopWidth: 4,
        borderColor: COLORS.backgroundColorButton,
        borderStyle: 'solid',
    },

    subRow: {
        borderTopWidth: 4,
        borderColor: COLORS.backgroundColorButton,
        borderStyle: 'solid',
    },

    text: {
        padding: 12,
        color: COLORS.white,
        fontSize: 16,
    },

    periodText: {
        padding: 12,
        color: COLORS.white,
        fontSize: 16,
        textAlign: 'center',
    },
})

export default HistoryScreen;