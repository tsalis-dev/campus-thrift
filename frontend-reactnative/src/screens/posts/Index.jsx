import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { BACKEND_API_URL } from '@env';
import Api from '../../services/api';

const PostIndex = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await Api.get('/api/posts');
      setPosts(response.data.data);
    } catch (error) {
      console.log('Error fetching posts:', error);
      ToastAndroid.show('Gagal memuat barang thrift!', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const handleDelete = (id, title) => {
    Alert.alert(
      'Hapus Barang',
      `Apakah Anda yakin ingin menghapus "${title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await Api.delete(`/api/posts/${id}`);
              ToastAndroid.show('Barang berhasil dihapus!', ToastAndroid.SHORT);
              fetchPosts();
            } catch (error) {
              console.log('Error deleting post:', error);
              ToastAndroid.show('Gagal menghapus barang!', ToastAndroid.SHORT);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const imageUrl = `${BACKEND_API_URL || 'http://10.0.2.2:3000'}/uploads/${item.image}`;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardContent} numberOfLines={3}>
            {item.content}
          </Text>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={() => navigation.navigate('PostEdit', { id: item.id })}
            >
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDelete(item.id, item.title)}
            >
              <Text style={styles.btnText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Thrift</Text>
        <Text style={styles.headerSubtitle}>
          Pasar Jual-Beli & Tukar Barang Mahasiswa Kampus
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Memuat katalog thrift...</Text>
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>Belum ada barang yang dijual</Text>
          <Text style={styles.emptySubtitle}>
            Tekan tombol + di pojok kanan bawah untuk menjual barang bekas Anda!
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostCreate')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#93c5fd',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e2e8f0',
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  editBtn: {
    backgroundColor: '#0284c7',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabIcon: {
    fontSize: 32,
    color: '#ffffff',
    lineHeight: 34,
    fontWeight: '300',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PostIndex;
