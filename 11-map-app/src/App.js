import { SafeAreaView, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import useFetch from './hooks/useFetch';
import Config from 'react-native-config';
import Loader from './components/Loader';
import UserMarker from './components/UserMarker';
import { useRef, useState } from 'react';
import InfoCard from './components/InfoCard';

function App() {
  const { data, error, loading } = useFetch(Config.API_URL);
  const mapRef = useRef();
  const [user, setUser] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);

  const renderUserMarker = () => {
    return data.results.map(userItem => {
      const {
        login,
        picture,
        location: { coordinates },
      } = userItem;
      return (
        <UserMarker
          key={login.uuid}
          coordinate={{
            latitude: parseFloat(coordinates.latitude),
            longitude: parseFloat(coordinates.longitude),
          }}
          userImageURL={picture.large}
          onPress={() => handleMarkerSelect(coordinates, userItem)}
        />
      );
    });
  };

  const handleMarkerSelect = (coor, selectedUser) => {
    setUser(selectedUser);
    setInfoVisible(true);
    mapRef.current?.animateToRegion({
      latitude: parseFloat(coor.latitude),
      longitude: parseFloat(coor.longitude),
      latitudeDelta: 20,
      longitudeDelta: 20,
    });
  };

  const handleModalClose = () => {
    setInfoVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView ref={mapRef} provider="google" style={{ flex: 1 }}>
        {data?.results && renderUserMarker()}
      </MapView>

      {user && (
        <InfoCard user={user} visible={infoVisible} close={handleModalClose} />
      )}

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
