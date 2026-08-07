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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { QuestionItem, RootStackParamList } from '../types';

type NavProp = StackNavigationProp<RootStackParamList>;

export const MyQuestionsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const questions = INITIAL_QUESTIONS;

  const renderItem = ({ item }: { item: QuestionItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ConversationDetail', { question: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name={item.starred ? 'star' : 'star-outline'}
            size={22}
            color={item.starred ? '#f59e0b' : Colors.outline}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.questionText} numberOfLines={2}>{item.question}</Text>
      <Text style={styles.summaryText} numberOfLines={2}>{item.summary}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons
            name={item.sourceType === 'PHONE' ? 'cellphone' : item.sourceType === 'APP' ? 'application' : 'message-text'}
            size={14}
            color={Colors.outline}
          />
          <Text style={Typography.boldLabel}>{item.sourceType}</Text>
          <View style={styles.dot} />
          <Text style={Typography.boldLabel}>{item.date}</Text>
          <View style={styles.dot} />
          <Text style={Typography.boldLabel}>{item.language}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.outline} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={Typography.boldLabel}>Your Activity</Text>
          <Text style={Typography.titleLg}>My Questions</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialCommunityIcons name="filter-variant" size={20} color={Colors.primary} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.containerPadding,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 20,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryChip: {
    backgroundColor: Colors.statusGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.outline,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.outline,
  },
});
