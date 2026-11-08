import React from 'react';
import IntroScreen from '../components/IntroScreen';

export default function GoalsScreen({ navigation }) {
  return (
    <IntroScreen
      navigation={navigation}
      icon="flag-outline"
      title="Your goals matter"
      message="Give your ambitions a little room to grow, one step at a time."
      nextFeature="Create personal academic goals and view their details."
    />
  );
}
