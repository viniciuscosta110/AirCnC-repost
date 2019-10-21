import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, AsyncStorage, Image, StyleSheet, Platform, StatusBar, Alert } from 'react-native';

import socketio from 'socket.io-client';

import SpotList from '../components/SpotList';
import logo from '../assets/logo.png';

export default function List() {
    const [techs, setTechs] = useState([]);

    useEffect(()=> {
        AsyncStorage.getItem('user').then(user_id=> {
            const socket = socketio('http://192.168.1.2:3333', {
                query: {user_id}
            }) 

            socket.on('booking_reponse', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`);
            })
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Image  style={styles.logo} source={logo}/>

                {techs.map(tech=> <SpotList tech={tech}  key={tech} /> )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },

    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 10
    }
});