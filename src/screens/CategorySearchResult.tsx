import React, {useState, useEffect} from 'react'
import {Text, FlatList, StyleSheet, TouchableOpacity, View} from 'react-native'
import MovieItem from '../components/movies/MovieItem'
import {API_ACCESS_TOKEN} from '@env'

interface Genre {
  id: number
  name: string
}

export default function CategoryResults({route}): JSX.Element {
  const {genre} = route.params as {genre: Genre}

  const [movieByGenreList, setMovieByGenreList] = useState([])

  useEffect(() => {
    getMovieByGenreList()
  }, [])

  const getMovieByGenreList = () => {
    const url = `https://api.themoviedb.org/3/discover/movie?page=1&with_genres=${genre.id}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovieByGenreList(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.genreResultTitle}>Result of {genre.name} Genre</Text>
      <FlatList
        data={movieByGenreList}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.itemContainer}>
            <MovieItem movie={item} size={{width: 95, height: 160}} coverType="poster" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${item.id}`}
        numColumns={3}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 50,
  },
  genreResultTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemContainer: {
    marginHorizontal: 7,
    marginVertical: 9,
    alignItems: 'center',
  },
  list: {
    paddingBottom: 100,
  },
})