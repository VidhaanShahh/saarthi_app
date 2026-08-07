import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { SaarthiLogo } from '../components/SaarthiLogo';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { QuestionItem, RootStackParamList } from '../types';

type NavProp = StackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const [pulseAnim] = useState(new Animated.Value(1));

  // Mic pulse animation
  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const handleSelectQuestion = useCallback((q: QuestionItem) => {
    navigation.navigate('ConversationDetail', { question: q });
  }, [navigation]);

  const quickActions = [
    { label: 'Ask Saarthi', icon: 'face-agent' as const, color: Colors.primary, onPress: () => navigation.navigate('Voice') },
    { label: 'Explain This', icon: 'lightbulb-on' as const, color: '#00405c', onPress: () => navigation.navigate('ExplainThis') },
    { label: 'Saved Info', icon: 'bookmark' as const, color: Colors.surfaceContainerHighest, textColor: Colors.onSurface, onPress: () => {} },
    { label: 'Offline Help', icon: 'flash' as const, color: Colors.surfaceContainerHighest, textColor: Colors.onSurface, onPress: () => {} },
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <SaarthiLogo size="sm" showText />
        <TouchableOpacity style={styles.languagePill}>
          <Text style={styles.languagePillText}>मराठी</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={Typography.boldHeadlineSm}>
          How can we help{'\n'}you today?
        </Text>
        <Text style={styles.subtitle}>
          Your voice assistant for legal rights, FIRs & welfare schemes
        </Text>
      </View>

      {/* Mic Button */}
      <View style={styles.micSection}>
        <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
        <Animated.View
          style={[
            styles.pulseRing,
            { transform: [{ scale: pulseAnim }], opacity: 0.3 },
          ]}
        />
        <TouchableOpacity
          style={styles.micButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Voice')}
        >
          <MaterialCommunityIcons name="microphone" size={48} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.micInfo}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>Active Session</Text>
          </View>
          <Text style={styles.micTitle}>Listening for your voice...</Text>
          <Text style={styles.micSubtitle}>Ask in your own language (Marathi)</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsGrid}>
        {quickActions.map((action, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={action.onPress}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <MaterialCommunityIcons
                name={action.icon}
                size={24}
                color={action.textColor || Colors.white}
              />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Questions */}
      <View style={styles.recentCard}>
        <View style={styles.recentHeader}>
          <View>
            <Text style={Typography.boldLabel}>Recent Conversations</Text>
            <Text style={Typography.titleMd}>History</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        {INITIAL_QUESTIONS.slice(0, 3).map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.questionRow,
              idx < 2 && styles.questionRowBorder,
            ]}
            activeOpacity={0.7}
            onPress={() => handleSelectQuestion(item)}
          >
            <View style={styles.questionIcon}>
              <MaterialCommunityIcons
                name={item.sourceType === 'PHONE' ? 'chat' : item.sourceType === 'APP' ? 'history' : 'file-document'}
                size={20}
                color={Colors.secondary}
              />
            </View>
            <View style={styles.questionContent}>
              <Text style={styles.questionTitle} numberOfLines={1}>
                {item.question}
              </Text>
              <View style={styles.questionMeta}>
                <Text style={Typography.boldLabel}>{item.date}</Text>
                <View style={styles.metaDot} />
                <Text style={Typography.boldLabel}>{item.language}</Text>
                <View style={styles.metaDot} />
                <Text style={Typography.boldLabel}>{item.sourceType}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.outline} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: Spacing.containerPadding,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  languagePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
  },
  languagePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  greeting: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  micSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  pulseRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.secondary,
    opacity: 0.15,
  },
  micButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.mic,
    zIndex: 10,
  },
  micInfo: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.statusGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginBottom: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.statusGreenText,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  micTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  micSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.outline,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: Spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    ...Shadows.card,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
  recentCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 20,
    marginTop: Spacing.lg,
    ...Shadows.card,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    marginBottom: 4,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 1,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  questionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  questionIcon: {
    marginTop: 2,
  },
  questionContent: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.outline,
  },
});
