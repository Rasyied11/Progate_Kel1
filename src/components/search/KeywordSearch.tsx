import React, {useState} from 'react'
import {View, TextInput, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import {AntDesign} from '@expo/vector-icons'
import {API_ACCESS_TOKEN} from '@env'
import {Movie} from '../../types/app'
import MovieItem from '../movies/MovieItem'

export default function KeywordSearch(): JSX.Element {
  const [keyword, setKeyword] = useState<string>('')
  const [movieSearchResult, setMovieSearchResult] = useState<Movie[]>([])

  const handleOnChangeText = (text: string) => {
    setKeyword(text)
  }

  const handleOnSubmitEditing = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`
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
        setMovieSearchResult(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Input title movie here"
          value={keyword}
          onChangeText={handleOnChangeText}
          onSubmitEditing={handleOnSubmitEditing}
        />
        <AntDesign style={styles.iconSearch} name="search1" size={24} />
      </View>
      <View style={styles.searchMovieResultContainer}>
        <FlatList
          data={movieSearchResult}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.movieItemContainer}>
              <MovieItem movie={item} size={{width: 95, height: 160}} coverType="poster" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.movieList}
          numColumns={3}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingBottom: 180,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    height: 60,
    backgroundColor: '#e6e6e6',
    borderRadius: 100,
    paddingLeft: 20,
  },
  iconSearch: {
    right: 5,
    position: 'absolute',
    paddingRight: 20,
  },
  searchMovieResultContainer: {
    flex: 1,
    paddingHorizontal: 19,
    marginTop: 8,
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
})