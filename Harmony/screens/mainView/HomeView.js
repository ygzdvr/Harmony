import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import COLORS from '../../constants/colors';

const Tile = ({title, isRectangle = false}) => (
  <TouchableOpacity
    style={[styles.tile, isRectangle ? styles.rectangleTile : null]}>
    <Text style={styles.tileText}>{title}</Text>
  </TouchableOpacity>
);

const HomeView = () => {
  const rectangularTiles = ['Rectangle 1', 'Rectangle 2'];
  const exampleTiles = ['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4', 'Tile 5'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Tracks</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {rectangularTiles.map((title, index) => (
            <Tile key={index} title={title} isRectangle />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {exampleTiles.map((title, index) => (
            <Tile key={index} title={title} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>People Nearby Listen To</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {exampleTiles.map((title, index) => (
            <Tile key={index} title={title} />
          ))}
        </ScrollView>
      </View>

      {/* Additional tiles and scrollable sections can be added here */}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  textTitle: {
    fontSize: 24,
    olor: COLORS.text,
    fontWeight: 'bold',
  },
  textDescription: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  tile: {
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: COLORS.tabBar,
    borderColor: COLORS.primary,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rectangleTile: {
    width: 300, // Twice the width of the original tiles
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  // Add styles for tiles and scrollable elements here
});

export default HomeView;
