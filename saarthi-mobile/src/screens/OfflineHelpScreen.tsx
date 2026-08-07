import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { INITIAL_OFFLINE_GUIDES } from '../data/initialData';
import { OfflineGuide } from '../types';

export const OfflineHelpScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedGuide, setSelectedGuide] = useState<OfflineGuide | null>(null);

  const getIcon = (iconName: string): string => {
    const map: Record<string, string> = {
      gavel: 'gavel',
      'account-balance': 'bank',
      'phone-alert': 'phone-alert',
      bookmark: 'bookmark',
    };
    return map[iconName] || 'help-circle';
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Legal': return Colors.secondary;
      case 'Welfare': return '#00405c';
      case 'Emergency': return Colors.error;
      case 'Personal': return Colors.primary;
      default: return Colors.outline;
    }
  };

  const renderGuide = ({ item }: { item: OfflineGuide }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => setSelectedGuide(item)}>
      <View style={[styles.cardIcon, { backgroundColor: getCategoryColor(item.category) }]}>
        <MaterialCommunityIcons name={getIcon(item.icon) as any} size={24} color={Colors.white} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.outline} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={Typography.boldLabel}>Available Offline</Text>
          <Text style={Typography.titleLg}>Offline Help</Text>
        </View>
        <View style={styles.offlineBadge}>
          <MaterialCommunityIcons name="wifi-off" size={16} color={Colors.white} />
        </View>
      </View>

      <View style={styles.infoBanner}>
        <MaterialCommunityIcons name="information" size={18} color={Colors.secondary} />
        <Text style={styles.infoText}>These guides are available even without internet connection</Text>
      </View>

      <FlatList
        data={INITIAL_OFFLINE_GUIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderGuide}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* Guide Detail Modal */}
      <Modal visible={!!selectedGuide} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={Typography.titleLg}>{selectedGuide?.title}</Text>
              <TouchableOpacity onPress={() => setSelectedGuide(null)}>
                <MaterialCommunityIcons name="close" size={24} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>{selectedGuide?.content}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.containerPadding, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
  },
  offlineBadge: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.statusGreen,
    marginHorizontal: Spacing.containerPadding, padding: 14, borderRadius: BorderRadius.lg, marginBottom: 12,
  },
  infoText: { fontSize: 13, fontWeight: '600', color: Colors.secondary, flex: 1 },
  listContent: { paddingHorizontal: Spacing.containerPadding, paddingBottom: 100 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.outlineVariant,
    padding: 16, ...Shadows.card,
  },
  cardIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  cardDesc: { fontSize: 12, fontWeight: '500', color: Colors.outline, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: Spacing.containerPadding, maxHeight: '70%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.outlineVariant,
    alignSelf: 'center', marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  modalScroll: { flex: 1 },
  modalText: { fontSize: 15, fontWeight: '500', color: Colors.onSurface, lineHeight: 24 },
});
