import { useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function App() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const handleAdd = () => {
    setTodos([...todos, { text, done: false }]);
    setText('');
  };
  const handleToggle = index => {
    setTodos(todos =>
      todos.map((todo, i) =>
        i === index ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };
  const handleRender = ({ item, index }) => (
    <Text
      onPress={() => handleToggle(index)}
      style={[
        styles.text_box,
        {
          color: item.done ? 'gray' : 'white',
          backgroundColor: item.done ? '#36474F' : '#7DA453',
          textDecorationLine: item.done ? 'line-through' : 'none',
        },
      ]}
    >
      {item.text}
    </Text>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head_container}>
        <View style={styles.title_container}>
          <Text style={styles.title}>Yapılacaklar</Text>
          <Text style={styles.title}>
            {todos.filter(item => !item.done).length}
          </Text>
        </View>

        <FlatList
          data={todos}
          renderItem={handleRender}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={styles.footer_container}>
        <TextInput
          onChangeText={setText}
          value={text}
          style={styles.text}
          placeholder="Yapılacak..."
          placeholderTextColor={'gray'}
        />
        <View
          style={[
            styles.btn,
            { backgroundColor: text.length > 0 ? 'orange' : 'gray' },
          ]}
        >
          <Button
            onPress={handleAdd}
            disabled={text.length > 0 ? false : true}
            color="white"
            title="Kaydet"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#112027',
  },
  head_container: {
    flex: 1,
  },
  title_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'orange',
  },
  footer_container: {
    backgroundColor: '#36474F',
    margin: 10,
    borderRadius: 10,
    padding: 10,
  },
  text: {
    borderBottomWidth: 1,
    color: 'white',
    borderColor: '#788F9C',
    marginBottom: 5,
    padding: 5,
    fontSize: 16,
  },
  btn: {
    borderRadius: 10,
    margin: 10,
  },
  text_box: {
    padding: 12,

    borderRadius: 5,
    fontSize: 16,
    fontWeight: 600,
    margin: 5,
  },
});

export default App;
