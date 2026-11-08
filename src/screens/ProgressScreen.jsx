import React from 'react';
import IntroScreen from '../components/IntroScreen';

export default function ProgressScreen({ navigation }) {
  return (
    <IntroScreen
      navigation={navigation}
      icon="bar-chart-outline"
      title="Look how far you've come"
      message="Celebrate your effort, not just the final result."
      nextFeature="See completed tasks, saved goals, and your study-time summary."
    />
  );
}
