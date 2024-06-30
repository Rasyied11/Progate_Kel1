import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MovieItem from '../components/movies/MovieItem'
import {Movie} from '../types/app'

export default function Favorite(): JSX.Element {
  const [favoriteList, setFavoriteList] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    loadFavorites()
  }, [favoriteList])

  const loadFavorites = async (): Promise<void> => {
    try {
      const storedFavorites: string | null = await AsyncStorage.getItem('@FavoriteList')

      if (storedFavorites !== null) {
        const parsedFavorites: Movie[] = JSON.parse(storedFavorites)
        setFavoriteList(parsedFavorites)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading favorites:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {favoriteList.length === 0 ? (
        <Text style={styles.noFavorite}>No favorite movies yet.</Text>
      ) : (
        <FlatList
          data={favoriteList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.movieItemContainer}>
              <MovieItem movie={item} size={{width: 95, height: 160}} coverType="poster" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.movieList}
          numColumns={3}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 36,
    paddingVertical: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieList: {
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  movieItemContainer: {
    flexBasis: '35%',
  },
  separator: {
    height: 18,
    width: '100%',
  },
  noFavorite: {
    fontSize: 18,
    textAlign: 'center',
  },
})