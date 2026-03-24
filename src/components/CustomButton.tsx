import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomButton = () => {
  return (
    <View style={styles.container}>
      <Text>CustomButton</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomButton;
