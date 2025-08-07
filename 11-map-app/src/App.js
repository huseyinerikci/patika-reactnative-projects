import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import useFetch from './hooks/useFetch';
import Config from 'react-native-config';
import Loader from './components/Loader';

function App() {
  const { data, error, loading } = useFetch(Config.API_URL);
  console.log(data);
  return (
    <SafeAreaView style={styles.container}>
      <MapView provider="google" style={{ flex: 1 }} />
      {loading && <Loader />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
