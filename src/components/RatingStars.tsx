import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface RatingStarsProps {
  rating: number;
  maxValue?: number;
  size?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxValue = 5,
  size = 24,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxValue - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      {[...Array(fullStars)].map((_, i) => (
        <Icon key={`full-${i}`} name="star" size={size} color="#f1c40f" />
      ))}
      {hasHalfStar && (
        <Icon name="star-half" size={size} color="#f1c40f" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Icon key={`empty-${i}`} name="star-border" size={size} color="#f1c40f" />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default RatingStars;