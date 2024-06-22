import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MovieDetail(): JSX.Element {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Movie Detail Page</Text>
      <Button title="Kembali" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});