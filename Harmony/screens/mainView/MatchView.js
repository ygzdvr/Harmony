import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';

import HomeStyles from '../../constants/styles/HomeStyles';
import Swiper from 'react-native-deck-swiper';
import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../../constants/colors';

const MatchView = () => {
  const [cards, setCards] = useState([
    // Array of cards (replace with your data)
    {id: 1, text: 'Card 1'},
    {id: 2, text: 'Card 2'},
    // ... more cards
  ]);

  const swiperRef = useRef(null);

  const handleLeftSwipe = () => {
    swiperRef.current.swipeLeft();
  };

  const handleRightSwipe = () => {
    swiperRef.current.swipeRight();
  };

  return (
    <View style={styles.container}>
      <View style={styles.SwiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={cards}
          renderCard={card => {
            return (
              <View style={styles.card}>
                <Text>{card.text}</Text>
              </View>
            );
          }}
          onSwipedLeft={() => console.log('Swipe left')}
          onSwipedRight={() => console.log('Swipe right')}
          backgroundColor={COLORS.background}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLeftSwipe}>
          <Icon name="x" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRightSwipe}>
          <Icon name="heart" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: 'flex-start',
  },
  SwiperContainer: {
    justifyContent: 'center',
    marginTop: 30,
    padding: 20,
    width: '100%',
  },
  card: {
    borderRadius: 20,
    height: 200,
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'flex-start',
    width: '100%',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MatchView;
