import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, SafeAreaView, Image, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import Colors from '../constants/Colors';

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time - mins * 60;
    return { mins: formatNumber(mins), secs: formatNumber(secs) };
}

const MainScreen = props => {
    const [pomodoroMins, setPomodoroMins] = useState(25);
    const [breakMins, setBreakMins] = useState(5);
    const [longBreakMins, setLongBreakMins] = useState(15);

    const [clockStarted, setClockStarted] = useState(false);

    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [isPomodoroActive, setIsPomodoroActive] = useState(true);
    const [isBreakActive, setIsBreakActive] = useState(false);
    const [isLongBreakActive, setIsLongBreakActive] = useState(false);

    const [remainingSecs, setRemainingSecs] = useState(pomodoroMins * 60);
    const { mins, secs } = getRemaining(remainingSecs);

    const [durationClicked, setDurationClicked] = useState(false);
    const [multiPurposeText, setMultiPurposeText] = useState();
    const [durationType, setDurationType] = useState();

    const playbackObject = new Audio.Sound();

    const playSound = async () => {
        await playbackObject.loadAsync(require('../assets/sounds/beep.mp3'), { shouldPlay: true }, true);
    }

    const toggle = () => {
        setClockStarted(!clockStarted);
        setDurationClicked(false);
        setMultiPurposeText();
    }

    const reset = () => {
        setRemainingSecs(pomodoroMins * 60);
        setClockStarted(false);
        setIsPomodoroActive(true);
        setIsBreakActive(false);
        setIsLongBreakActive(false);
    }

    useEffect(() => {
        let interval = null;
        if (clockStarted && remainingSecs !== 0 && (isPomodoroActive || isBreakActive || isLongBreakActive)) {
            interval = setInterval(() => {
                setRemainingSecs(remainingSecs => remainingSecs - 1);
            }, 1000);
        } else if (clockStarted && isPomodoroActive && remainingSecs === 0) {
            playSound();
            Vibration.vibrate(2000);
            setPomodoroCount(pomodoroCount + 1);
            setIsPomodoroActive(false);
            if ((pomodoroCount + 1) % 4 !== 0) {
                setRemainingSecs(breakMins * 60);
                setIsBreakActive(true);
            } else {
                setRemainingSecs(longBreakMins * 60);
                setIsLongBreakActive(true);
            }
        } else if (clockStarted && (isBreakActive || isLongBreakActive) && remainingSecs === 0) {
            playSound();
            Vibration.vibrate(2000);
            setIsBreakActive(false);
            setIsLongBreakActive(false);
            setIsPomodoroActive(true);
            setRemainingSecs(pomodoroMins * 60);
        }
        return () => {
            clearInterval(interval);
        };
    }, [clockStarted, remainingSecs]);

    const updateDuration = (type) => {
        setDurationClicked(true);
        if (type === 'pomodoro') {
            setDurationType('pomodoro');
            setMultiPurposeText(pomodoroMins);
        } else if (type === 'break') {
            setDurationType('break');
            setMultiPurposeText(breakMins);
        } else {
            setDurationType('longBreak');
            setMultiPurposeText(longBreakMins);
        }
    }

    const addDuration = () => {
        if (durationType === 'pomodoro') {
            setMultiPurposeText(multiPurposeText + 1);
        } else if (durationType === 'break') {
            setMultiPurposeText(multiPurposeText + 1);
        } else {
            setMultiPurposeText(multiPurposeText + 1);
        }
    }

    const minusDuration = () => {
        if (durationType === 'pomodoro') {
            if (multiPurposeText - 1 > 0) {
                setMultiPurposeText(multiPurposeText - 1);
            }
        } else if (durationType === 'break') {
            if (multiPurposeText - 1 > 0) {
                setMultiPurposeText(multiPurposeText - 1);
            }
        } else {
            if (multiPurposeText - 1 > 0) {
                setMultiPurposeText(multiPurposeText - 1);
            }
        }
    }

    const setDuration = () => {
        if (durationType === 'pomodoro') {
            setPomodoroMins(multiPurposeText);
            setRemainingSecs(multiPurposeText * 60);
        } else if (durationType === 'break') {
            setBreakMins(multiPurposeText);
        } else {
            setLongBreakMins(multiPurposeText);
        }
        setDurationClicked(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={require('../assets/pomodoro.png')} style={styles.headerImage} />
                <Text style={styles.headerTitle}>pomodoro</Text>
                <Ionicons style={styles.headerInfoIcon} name='md-information-circle-outline' size={25} color='black' onPress={() => props.navigation.navigate({routeName: 'info'})} />
            </View>
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{mins}:{secs}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={reset} style={styles.button}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggle} style={styles.button}>
                        <Text style={styles.buttonText}>{clockStarted ? 'Pause' : remainingSecs !== pomodoroMins * 60 ? 'Resume' : 'Start'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.multiPurposeContainer}>
                {durationClicked && !clockStarted ?
                    <View style={styles.durationEditContainer}>
                        <View style={styles.durationEditHeader}>
                            <Ionicons name='md-remove' size={40} color={multiPurposeText === 1 ? 'grey' : 'black'} onPress={minusDuration} />
                            <Text style={styles.multiPurposeText}>{multiPurposeText}</Text>
                            <Ionicons name='md-add' size={40} color={multiPurposeText === 1 ? 'grey' : 'black'} onPress={addDuration} />
                        </View>
                        <Ionicons name='md-checkmark' size={50} color={multiPurposeText === 1 ? 'grey' : 'black'} onPress={setDuration} />
                    </View>
                    : null}
                <Text style={styles.multiPurposeText}>
                    {clockStarted && isPomodoroActive ? 'Work!' : ''}
                    {clockStarted && (isBreakActive || isLongBreakActive) ? 'Break' : ''}
                </Text>
            </View>
            <View style={styles.durationContainer}>
                <TouchableOpacity style={styles.durationCard} onPress={!clockStarted ? updateDuration.bind(this, 'pomodoro') : null}>
                    <Text style={!clockStarted ? styles.enableDurationTime : styles.disableDurationTime}>{pomodoroMins}</Text>
                    <Text>Pomodoro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.durationCard} onPress={!clockStarted ? updateDuration.bind(this, 'break') : null}>
                    <Text style={!clockStarted ? styles.enableDurationTime : styles.disableDurationTime}>{breakMins}</Text>
                    <Text>Break</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.durationCard} onPress={!clockStarted ? updateDuration.bind(this, 'longBreak') : null}>
                    <Text style={!clockStarted ? styles.enableDurationTime : styles.disableDurationTime}>{longBreakMins}</Text>
                    <Text>Long Break</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flex: 2,
        marginTop: 30,
        marginHorizontal: 20,
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
        marginLeft: 'auto'
    },
    timerContainer: {
        flex: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontFamily: 'digital-mono',
        fontSize: 128,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    button: {
        backgroundColor: Colors.primary,
        width: Dimensions.get('window').width / 3,
        height: Dimensions.get('window').height / 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 25
    },
    buttonText: {
        fontSize: 20,
        color: 'white'
    },
    multiPurposeContainer: {
        flex: 7,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    multiPurposeText: {
        fontSize: 100,
        marginHorizontal: 20,
        fontFamily: 'ubuntu-mono'
    },
    durationEditHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    durationEditContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    durationContainer: {
        flexDirection: 'row',
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    enableDurationTime: {
        fontSize: 30,
    },
    disableDurationTime: {
        fontSize: 30,
        color: 'grey'
    },
    durationCard: {
        borderColor: Colors.primary,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width / 4,
        margin: 5,
        marginBottom: 20,
    }
});

export default MainScreen;