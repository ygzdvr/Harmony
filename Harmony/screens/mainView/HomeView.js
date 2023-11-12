import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const Tile = ({title}) => (
  <TouchableOpacity style={styles.tile}>
    <Text style={styles.tileText}>{title}</Text>
  </TouchableOpacity>
);

const HomeView = () => {
  // Array of example tiles
  const exampleTiles = ['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4', 'Tile 5'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textTitle}>Welcome to Harmony</Text>
        <Text style={styles.textDescription}>
          Your personalized experience begins now!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Tracks & Albums</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {exampleTiles.map((title, index) => (
            <Tile key={index} title={title} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What People Nearby Listen To</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tile: {
    width: 150,
    height: 150,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // Add styles for tiles and scrollable elements here
});

export default HomeView;
