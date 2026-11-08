import React from 'react';
import IntroScreen from '../components/IntroScreen';

export default function FocusScreen({ navigation }) {
  return (
    <IntroScreen
      navigation={navigation}
      icon="timer-outline"
      title="Your focus corner"
      message="A calm space to study without rushing yourself."
      nextFeature="Start, pause, and reset a friendly 25-minute study timer."
    />
  );
}
