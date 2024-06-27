import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieList from '../components/movies/MovieList';
import { FontAwesome } from '@expo/vector-icons';
import type { Movie } from '../types/app';  // Import the Movie type

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

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
});

export default MovieDetail;
