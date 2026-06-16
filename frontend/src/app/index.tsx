import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import api from '@/services/api';

type Game = {
  _id: string;
  title: string;
  platform: string;
  genre: string;
  status: string;
};

const statusOptions = ['Não iniciado', 'Jogando', 'Finalizado'];

export default function HomeScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('Não iniciado');

  async function loadGames() {
    try {
      const response = await api.get('/games');
      setGames(response.data);
    } catch (error) {
      console.log('Erro ao buscar jogos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addGame() {
    if (!title || !platform || !genre) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      await api.post('/games', {
        title,
        platform,
        genre,
        status,
      });

      setTitle('');
      setPlatform('');
      setGenre('');
      setStatus('Não iniciado');

      await loadGames();
    } catch (error) {
      console.log('Erro ao adicionar jogo:', error);
    }
  }

  async function finishGame(id: string) {
    try {
      await api.put(`/games/${id}`, {
        status: 'Finalizado',
      });

      await loadGames();
    } catch (error) {
      console.log('Erro ao finalizar jogo:', error);
    }
  }

  async function deleteGame(id: string) {
    try {
      await api.delete(`/games/${id}`);
      await loadGames();
    } catch (error) {
      console.log('Erro ao excluir jogo:', error);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando jogos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca de Jogos</Text>
      <Text style={styles.subtitle}>Meus jogos favoritos</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome do jogo"
          placeholderTextColor="#9ca3af"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Plataforma"
          placeholderTextColor="#9ca3af"
          value={platform}
          onChangeText={setPlatform}
        />

        <TextInput
          style={styles.input}
          placeholder="Gênero"
          placeholderTextColor="#9ca3af"
          value={genre}
          onChangeText={setGenre}
        />

        <Text style={styles.label}>Status</Text>

        <View style={styles.statusContainer}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.statusButton,
                status === option && styles.statusButtonSelected,
              ]}
              onPress={() => setStatus(option)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === option && styles.statusButtonTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addGame}>
          <Text style={styles.addButtonText}>Adicionar jogo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Meus jogos</Text>

      <FlatList
        data={games}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.statusBadge}>{item.status}</Text>
            </View>

            <Text style={styles.cardText}>Plataforma: {item.platform}</Text>
            <Text style={styles.cardText}>Gênero: {item.genre}</Text>

            <View style={styles.buttonContainer}>
              {item.status !== 'Finalizado' && (
                <TouchableOpacity
                  style={styles.finishButton}
                  onPress={() => finishGame(item._id)}
                >
                  <Text style={styles.finishText}>Finalizar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteGame(item._id)}
              >
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    padding: 13,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    color: '#374151',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statusButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusButtonSelected: {
    backgroundColor: '#111827',
  },
  statusButtonText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusButtonTextSelected: {
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  cardText: {
    color: '#4b5563',
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  finishButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishText: {
    color: '#111827',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#991b1b',
    fontWeight: 'bold',
  },
});