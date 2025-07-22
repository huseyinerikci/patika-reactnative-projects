import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import styles from './JobCard.style';

const JobCard = ({ job, onSelect }) => {
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={styles.container}>
        <View style={styles.body_container}>
          <Text style={styles.title}>{job.name}</Text>
          <Text>Sprinklr</Text>
          <View>
            <Text style={styles.loc}>{job.locations[0].name}</Text>
          </View>
          <Text style={styles.pos}>{job.levels[0].name}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default JobCard;
