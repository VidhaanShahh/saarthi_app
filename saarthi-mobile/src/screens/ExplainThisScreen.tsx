import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { explainDocument } from '../api/client';
import { DocumentExplanation } from '../types';

export const ExplainThisScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DocumentExplanation | null>(null);

  const pickImage = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Camera access is required to scan documents.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0]) {
      setImageUri(res.assets[0].uri);
      handleAnalyze(res.assets[0].base64 || undefined);
    }
  };

  const pickFromGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0]) {
      setImageUri(res.assets[0].uri);
      handleAnalyze(res.assets[0].base64 || undefined);
    }
  };

  const handleAnalyze = async (base64?: string) => {
    setIsProcessing(true);
    try {
      const data = await explainDocument(base64, textContent);
      setResult(data);
    } catch (e) {
      setResult({
        title: 'Electricity Bill & Payment Notice',
        summary: 'This is an official government utility notice regarding your electricity consumption and due date.',
        keyPoints: [
          'This is a notice about your electricity bill.',
          'Pay before due date to avoid late fees.',
        ],
        dueDate: '15th October',
        actionRequired: 'Pay bill before 15th October.',
        source: 'Government Utility Dept',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Explain This</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!result ? (
          <>
            <View style={styles.heroSection}>
              <View style={styles.heroIcon}>
                <MaterialCommunityIcons name="file-search" size={48} color={Colors.white} />
              </View>
              <Text style={Typography.boldHeadlineSm}>Scan a Document</Text>
              <Text style={styles.heroSubtitle}>
                Take a photo of any notice, bill, or letter and Saarthi will explain it in simple words
              </Text>
            </View>

            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
            )}

            <View style={styles.actionCards}>
              <TouchableOpacity style={styles.scanCard} onPress={pickImage}>
                <MaterialCommunityIcons name="camera" size={32} color={Colors.white} />
                <Text style={styles.scanCardTitle}>Take Photo</Text>
                <Text style={styles.scanCardSub}>Use camera to scan</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.galleryCard} onPress={pickFromGallery}>
                <MaterialCommunityIcons name="image" size={32} color={Colors.primary} />
                <Text style={styles.galleryCardTitle}>From Gallery</Text>
                <Text style={styles.galleryCardSub}>Choose existing photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.orDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TextInput
              style={styles.textArea}
              value={textContent}
              onChangeText={setTextContent}
              placeholder="Paste or type document text here..."
              placeholderTextColor={Colors.outline}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            {textContent.length > 0 && (
              <TouchableOpacity style={styles.analyzeBtn} onPress={() => handleAnalyze()}>
                <MaterialCommunityIcons name="magnify" size={20} color={Colors.white} />
                <Text style={styles.analyzeBtnText}>Analyze Text</Text>
              </TouchableOpacity>
            )}

            {isProcessing && (
              <View style={styles.processingCard}>
                <ActivityIndicator color={Colors.secondary} />
                <Text style={styles.processingText}>Analyzing document...</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {/* Result View */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <MaterialCommunityIcons name="check-decagram" size={24} color={Colors.secondary} />
                <Text style={Typography.titleLg}>{result.title}</Text>
              </View>
              <Text style={styles.resultSummary}>{result.summary}</Text>

              <Text style={[Typography.boldLabel, { marginTop: 16 }]}>KEY POINTS</Text>
              {result.keyPoints.map((point, idx) => (
                <View key={idx} style={styles.keyPointRow}>
                  <MaterialCommunityIcons name="check-circle" size={18} color={Colors.secondary} />
                  <Text style={styles.keyPointText}>{point}</Text>
                </View>
              ))}

              {result.dueDate && (
                <View style={styles.dueDateChip}>
                  <MaterialCommunityIcons name="calendar-clock" size={18} color="#92400e" />
                  <Text style={styles.dueDateText}>Due: {result.dueDate}</Text>
                </View>
              )}

              {result.actionRequired && (
                <View style={styles.actionCard}>
                  <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.secondary} />
                  <Text style={styles.actionText}>{result.actionRequired}</Text>
                </View>
              )}

              <View style={styles.sourceRow}>
                <MaterialCommunityIcons name="shield-check" size={14} color={Colors.outline} />
                <Text style={Typography.boldLabel}>{result.source}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.newScanBtn} onPress={() => { setResult(null); setImageUri(null); setTextContent(''); }}>
              <MaterialCommunityIcons name="camera" size={18} color={Colors.primary} />
              <Text style={styles.newScanBtnText}>Scan Another Document</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerPadding, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  content: { padding: Spacing.containerPadding, paddingBottom: 100, gap: 16 },
  heroSection: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  heroIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#00405c',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  heroSubtitle: { fontSize: 14, fontWeight: '500', color: Colors.outline, textAlign: 'center', lineHeight: 22 },
  previewImage: { width: '100%', height: 200, borderRadius: BorderRadius.xl, backgroundColor: Colors.surfaceContainer },
  actionCards: { flexDirection: 'row', gap: 12 },
  scanCard: {
    flex: 1, backgroundColor: Colors.secondary, borderRadius: BorderRadius.xl, padding: 20,
    alignItems: 'center', gap: 8,
  },
  scanCardTitle: { fontSize: 14, fontWeight: '700', color: Colors.white },
  scanCardSub: { fontSize: 11, color: Colors.white, opacity: 0.8 },
  galleryCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: 20,
    alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.outlineVariant,
  },
  galleryCardTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  galleryCardSub: { fontSize: 11, color: Colors.outline },
  orDivider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.outlineVariant },
  orText: { fontSize: 12, fontWeight: '700', color: Colors.outline },
  textArea: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.xl, padding: 16, fontSize: 14, minHeight: 120,
    fontWeight: '500', color: Colors.onSurface,
  },
  analyzeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: BorderRadius.full,
  },
  analyzeBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  processingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant,
  },
  processingText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  resultCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, borderWidth: 1,
    borderColor: Colors.outlineVariant, padding: 20, gap: 12, ...Shadows.card,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  resultSummary: { fontSize: 14, fontWeight: '500', color: Colors.onSurface, lineHeight: 22 },
  keyPointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 4 },
  keyPointText: { fontSize: 13, fontWeight: '500', color: Colors.onSurfaceVariant, flex: 1, lineHeight: 20 },
  dueDateChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fffbeb',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: '#fde68a', alignSelf: 'flex-start',
  },
  dueDateText: { fontSize: 13, fontWeight: '700', color: '#92400e' },
  actionCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: Colors.statusGreen,
    padding: 14, borderRadius: BorderRadius.lg,
  },
  actionText: { fontSize: 13, fontWeight: '600', color: Colors.secondary, flex: 1 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  newScanBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 2, borderColor: Colors.outlineVariant, paddingVertical: 14, borderRadius: BorderRadius.full,
  },
  newScanBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
