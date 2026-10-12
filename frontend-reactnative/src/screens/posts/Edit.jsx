import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { BACKEND_API_URL } from '@env';
import Api from '../../services/api';

const PostEdit = ({ route, navigation }) => {
  const { id } = route.params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await Api.get(`/api/posts/${id}`);
        const data = response.data.data;
        setTitle(data.title || '');
        setContent(data.content || '');
        setExistingImage(data.image || '');
      } catch (error) {
        console.log('Error fetching post detail:', error);
        ToastAndroid.show('Gagal mengambil data detail barang!', ToastAndroid.SHORT);
        navigation.goBack();
      } finally {
        setFetching(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleSelectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
      ToastAndroid.show('Gagal memilih gambar', ToastAndroid.SHORT);
    } else if (result.assets && result.assets.length > 0) {
      setNewImage(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    let currentErrors = {};
    if (!title.trim()) currentErrors.title = 'Judul barang & harga wajib diisi!';
    if (!content.trim()) currentErrors.content = 'Deskripsi kondisi & kontak wajib diisi!';

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      if (newImage) {
        formData.append('image', {
          uri: newImage.uri,
          name: newImage.fileName || `item_${Date.now()}.jpg`,
          type: newImage.type || 'image/jpeg',
        });
      }
      formData.append('title', title);
      formData.append('content', content);

      await Api.put(`/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      ToastAndroid.show('Data barang thrift berhasil diperbarui!', ToastAndroid.LONG);
      navigation.navigate('PostIndex');
    } catch (error) {
      console.log('Error updating item:', error.response?.data || error.message);
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        ToastAndroid.show('Gagal memperbarui barang. Cek koneksi backend!', ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Memuat data barang...</Text>
      </View>
    );
  }

  const currentDisplayImage = newImage
    ? { uri: newImage.uri }
    : { uri: `${BACKEND_API_URL || 'http://10.0.2.2:3000'}/uploads/${existingImage}` };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.formTitle}>Edit Informasi Barang Thrift</Text>
      <Text style={styles.formSubtitle}>Perbarui informasi harga, kondisi, atau ganti foto barang.</Text>

      {/* Image Section */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Foto Barang (Ketuk untuk ganti foto)</Text>
        <TouchableOpacity style={styles.imagePickerBtn} onPress={handleSelectImage}>
          <Image source={currentDisplayImage} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.changeOverlay}>
            <Text style={styles.changeText}>Ganti Foto</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Title Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nama Barang & Harga *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      {/* Content Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Deskripsi Kondisi, Lokasi COD, & No. WhatsApp *</Text>
        <TextInput
          style={[styles.textArea, errors.content && styles.inputError]}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Perbarui Data Barang</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    minHeight: 110,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  imagePickerBtn: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  changeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default PostEdit;
