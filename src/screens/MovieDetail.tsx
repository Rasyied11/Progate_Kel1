import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieList from '../components/movies/MovieList';
import { FontAwesome } from '@expo/vector-icons';
import type { Movie } from '../types/app'; 
import AsyncStorage from '@react-native-async-storage/async-storage'


const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false)

  useEffect(() => {
    fetchMovieDetails();
    fetchRecommendations();
  }, [id]);

  const fetchMovieDetails = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovie(response);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  //Adding Favorite
  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
      console.log(initialData)

      let favMovieList: Movie[] = []

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie]
      } else {
        favMovieList = [movie]
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
      setIsFavorite(true)
    } catch (error) {
      console.log(error)
    }
  }

  //Remove Favorite
  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
      console.log(initialData)

      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        const updatedFavMovieList = favMovieList.filter((favMovie) => favMovie.id !== id)
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(updatedFavMovieList))
        setIsFavorite(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  //Toggle Favorite
  const toggleFavorite = (): void => {
    if (isFavorite && movie) {
      removeFavorite(id).then(() => setIsFavorite(false))
    } else if (movie) {
      addFavorite(movie).then(() => setIsFavorite(true))
    }
  }

  //Check Is Favorite
  const checkIsFavorite = async (id: number): Promise<boolean> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        return favMovieList.some((favMovie) => favMovie.id === id)
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const fetchRecommendations = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setRecommendations(response.results);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  if (!movie) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const formattedReleaseDate = new Date(movie.release_date).toLocaleDateString();

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          style={styles.poster}
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={24} color="yellow" />
              <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
            </View>
            <FontAwesome
                name={isFavorite ? 'heart' : 'heart-o'}
                size={24}
                color={isFavorite ? 'pink' : 'white'}
                style={styles.favIcon}
                onPress={toggleFavorite}
              />
          </View>
        </ImageBackground>
        <Text style={styles.overview}>{movie.overview}</Text>
        <View style={styles.detailContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Release Date:</Text>
            <Text style={styles.detailValue}>{formattedReleaseDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Popularity:</Text>
            <Text style={styles.detailValue}>{movie.popularity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Original Language:</Text>
            <Text style={styles.detailValue}>{movie.original_language}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Vote Count:</Text>
            <Text style={styles.detailValue}>{movie.vote_count}</Text>
          </View>
        </View>
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          <MovieList
            title=""
            path={`movie/${id}/recommendations`}
            coverType="poster"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    width: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    color: 'yellow',
    fontSize: 18,
    marginLeft: 4,
  },
  overview: {
    fontSize: 16,
    marginVertical: 8,
  },
  detailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  detailItem: {
    width: '50%',
    flexDirection: 'row',
    marginVertical: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 16,
  },
  recommendationsContainer: {
    marginTop: 16,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  favIcon: {
    alignSelf: 'flex-end',
    paddingRight: 10,
    paddingBottom: 3,
  },
});

export default MovieDetail;
