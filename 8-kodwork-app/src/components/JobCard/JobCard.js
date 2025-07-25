import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import styles from './JobCard.style';
import { useDispatch } from 'react-redux';
import Button from '../Button';

const JobCard = ({ job, onSelect, showRemoveButton }) => {
  const dispatch = useDispatch();
  const handleRemove = () => {
    dispatch({ type: 'REMOVE_FROM_LIST', payload: job });
  };
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

          {showRemoveButton && (
            <View style={styles.rmv_btn}>
              <Button text="Remove" onPress={handleRemove} />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default JobCard;
