import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InfoScreen = props => {
    return (
        <View style={styles.screen}>
            <View style={styles.headerContainer}>
                <Ionicons style={styles.headerInfoIcon} name='md-arrow-back' size={25} color='black' onPress={() => props.navigation.navigate('main')} />
                <Text style={styles.headerTitle}>technique</Text>
            </View>
            <View style={styles.description}>
                <Text style={styles.descriptionText}>The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro, from the Italian word for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a university student.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff'
    },
    headerContainer: {
        marginTop: 35,
        marginHorizontal: 25,
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerImage: {
        width: 25,
        height: 25,
        marginRight: 6,
        marginTop: 8
    },
    headerTitle: {
        fontFamily: 'ubuntu-mono',
        fontSize: 30
    },
    headerInfoIcon: {
        marginRight: 10,
        marginTop: 10
    },
    description: {
        margin: 22,
    },
    descriptionText: {
        fontSize: 18
    }
});

export default InfoScreen;