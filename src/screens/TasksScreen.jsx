import React from 'react';
import IntroScreen from '../components/IntroScreen';

export default function TasksScreen({ navigation }) {
  return (
    <IntroScreen
      navigation={navigation}
      icon="checkbox-outline"
      title="Let's plan your day"
      message="A peaceful place for everything you need to get done."
      nextFeature="Add tasks, mark them complete, and find tasks with a simple search."
    />
  );
}
