import React, { useState } from 'react';
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
import Api from '../../services/api';

const PostCreate = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      setImage(result.assets[0]);
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const handleSave = async () => {
    let currentErrors = {};
    if (!image) currentErrors.image = 'Foto barang wajib diunggah!';
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
      formData.append('image', {
        uri: image.uri,
        name: image.fileName || `item_${Date.now()}.jpg`,
        type: image.type || 'image/jpeg',
      });
      formData.append('title', title);
      formData.append('content', content);

      await Api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      ToastAndroid.show('Barang thrift berhasil ditambahkan!', ToastAndroid.LONG);
      navigation.navigate('PostIndex');
    } catch (error) {
      console.log('Error creating item:', error.response?.data || error.message);
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg;
        });
        setErrors(backendErrors);
      } else {
        ToastAndroid.show('Gagal menyimpan barang. Cek koneksi backend!', ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.formTitle}>Jual Barang Thrift Anda</Text>
      <Text style={styles.formSubtitle}>
        Isi detail informasi perlengkapan atau buku yang ingin Anda jual ke sesama mahasiswa.
      </Text>

      {/* Upload Image Section */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Foto Barang *</Text>
        <TouchableOpacity style={styles.imagePickerBtn} onPress={handleSelectImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderIcon}>📷</Text>
              <Text style={styles.placeholderText}>Ketuk untuk memilih foto dari galeri</Text>
            </View>
          )}
        </TouchableOpacity>
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
      </View>

      {/* Title Input */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nama Barang & Harga *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="Contoh: Buku Kalkulus Purcell Edisi 9 - Rp 45.000"
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
          placeholder="Jelaskan kondisi barang (misal: 90% mulus, ada sedikit coretan pensil), lokasi fakultas untuk COD, dan kontak WhatsApp Anda."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Publikasikan Barang Thrift</Text>
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
    lineHeight: 18,
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
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#94a3b8',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  placeholderText: {
    fontSize: 13,
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: '#2563eb',
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

export default PostCreate;
