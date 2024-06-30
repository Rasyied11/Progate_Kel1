import React, { useCallback,useState, useEffect } from 'react'
import { debounce } from "lodash";
import { TextInput, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import KeywordSearch from '../components/search/KeywordSearch'
import CategorySearch from '../components/search/CategorySearch'
import { FontAwesome } from '@expo/vector-icons';

const handleSearch = ():any =>{

}

const Search = (): JSX.Element => {
  const [selectedBar, setSelectedBar] = useState<string>('keyword')
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  return (
    <View style={styles.container}>
      <View>  
        <View style={styles.topBarContainer}>
          {['keyword', 'category'].map((item: string, index: number) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.9}
              style={{
                ...styles.topBar,
                backgroundColor: item === selectedBar ? '#2f9bec' : '#75bef4',
                borderTopLeftRadius: index === 0 ? 100 : 0,
                borderBottomLeftRadius: index === 0 ? 100 : 0,
                borderTopRightRadius: index === 1 ? 100 : 0,
                borderBottomRightRadius: index === 1 ? 100 : 0,
              }}
              onPress={() => {
                setSelectedBar(item)
              }}
            >
              <Text style={styles.topBarLabel}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedBar === 'keyword' ? <KeywordSearch /> : <CategorySearch />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  topBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: 60,
  },
  topBarLabel: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
})

export default Search