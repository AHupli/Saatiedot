import * as Location from 'expo-location';
import Weather from './Weather';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Position() {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [message, setMessage] = useState('Retrieving location...');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const getLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                console.log(status);
                if (status !== 'granted') {
                    if (isMounted) {
                        setMessage("Location not permitted.");
                    }
                } else {
                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                    });
                    if (isMounted) {
                        if (location.coords) {
                            setLatitude(location.coords.latitude);
                            setLongitude(location.coords.longitude);
                            setMessage('Location retrieved');
                        } else {
                            setMessage("Location data is not available.");
                        }
                        setIsLoading(false);
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setMessage("Error retrieving location.");
                    console.log(error);
                    setIsLoading(false);
                }
            }
        };

        getLocation();

        const locationListener = Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 60000, distanceInterval: 10 },
            (location) => {
                if (isMounted && location.coords) {
                    setLatitude(location.coords.latitude);
                    setLongitude(location.coords.longitude);
                    setMessage('Location updated');
                }
            }
        );

        return () => {
            isMounted = false;
            locationListener.remove();
        };
    }, []);

    return (
        <View>
            <Text style={styles.coords}>{latitude.toFixed(3)},{longitude.toFixed(3)}</Text>
            <Text style={styles.message}>{message}</Text>
            {isLoading === false &&
                <Weather latitude={latitude} longitude={longitude} />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    coords: {
        // Add your styles for the coords text here
    },
    message: {
        // Add your styles for the message text here
    },
});