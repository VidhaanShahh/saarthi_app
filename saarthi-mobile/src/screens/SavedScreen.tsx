import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { INITIAL_SAVED_ITEMS } from '../data/initialData';
import { SavedItem } from '../types';

export const SavedScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const getCategoryIcon = (cat: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (cat) {
      case 'Legal': return 'gavel';
      case 'Government Scheme': return 'bank';
      case 'Housing': return 'home-city';
      default: return 'bookmark';
    }
  };

  const renderItem = ({ item }: { item: SavedItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryChip}>
          <MaterialCommunityIcons name={getCategoryIcon(item.category)} size={14} color={Colors.secondary} />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="star" size={20} color="#f59e0b" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={Typography.boldLabel}>Bookmarks</Text>
          <Text style={Typography.titleLg}>Saved Information</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{INITIAL_SAVED_ITEMS.length}</Text>
        </View>
      </View>

      <FlatList
        data={INITIAL_SAVED_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bookmark-off-outline" size={48} color={Colors.outline} />
            <Text style={styles.emptyText}>No saved items yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.containerPadding, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
  },
  countBadge: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  listContent: { paddingHorizontal: Spacing.containerPadding, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, borderWidth: 1,
    borderColor: Colors.outlineVariant, padding: 20, ...Shadows.card,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.statusGreen,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: Colors.secondary, textTransform: 'uppercase' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 6 },
  cardDesc: { fontSize: 13, fontWeight: '500', color: Colors.outline, lineHeight: 18 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '600', color: Colors.outline },
});
