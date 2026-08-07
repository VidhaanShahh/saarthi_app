import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { RootStackParamList } from '../types';

type NavProp = StackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'ConversationDetail'>;

export const ConversationDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const question = route.params.question;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>Conversation</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name={question.starred ? 'star' : 'star-outline'}
            size={24}
            color={question.starred ? '#f59e0b' : Colors.outline}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Bubble */}
        <View style={styles.questionBubble}>
          <View style={styles.questionMeta}>
            <MaterialCommunityIcons name="account-voice" size={18} color={Colors.secondary} />
            <Text style={Typography.boldLabel}>YOUR QUESTION</Text>
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
          <View style={styles.metaRow}>
            <Text style={Typography.boldLabel}>{question.date}</Text>
            <View style={styles.dot} />
            <Text style={Typography.boldLabel}>{question.language}</Text>
            <View style={styles.dot} />
            <Text style={Typography.boldLabel}>{question.sourceType}</Text>
          </View>
        </View>

        {/* Verified Source */}
        <View style={styles.sourceChip}>
          <MaterialCommunityIcons name="shield-check" size={16} color={Colors.secondary} />
          <Text style={styles.sourceText}>{question.verifiedSource || 'Official Government Source'}</Text>
        </View>

        {/* Summary */}
        <View style={styles.answerCard}>
          <Text style={Typography.boldLabel}>OFFICIAL ANSWER</Text>
          <Text style={styles.summaryText}>{question.summary}</Text>

          {/* Steps */}
          {question.steps.map((step) => (
            <View key={step.number} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Simplified Summary */}
        {question.simplifiedSummary && (
          <View style={styles.simplifiedCard}>
            <View style={styles.simplifiedHeader}>
              <MaterialCommunityIcons name="lightbulb-on" size={20} color="#f59e0b" />
              <Text style={styles.simplifiedLabel}>SIMPLE SUMMARY</Text>
            </View>
            <Text style={styles.simplifiedText}>{question.simplifiedSummary}</Text>
          </View>
        )}

        {/* Follow-up Suggestions */}
        {question.followups && question.followups.length > 0 && (
          <View style={styles.followupSection}>
            <Text style={Typography.boldLabel}>ASK FOLLOW-UP</Text>
            {question.followups.map((f, idx) => (
              <TouchableOpacity key={idx} style={styles.followupChip}>
                <MaterialCommunityIcons name="message-plus" size={16} color={Colors.secondary} />
                <Text style={styles.followupText}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.listenBtn}
          onPress={() => navigation.navigate('ListenAnswer', { question })}
        >
          <MaterialCommunityIcons name="volume-high" size={20} color={Colors.white} />
          <Text style={styles.listenBtnText}>Listen to Answer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => navigation.navigate('HumanHelp', { question })}
        >
          <MaterialCommunityIcons name="hand-heart" size={20} color={Colors.primary} />
          <Text style={styles.helpBtnText}>Get Human Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.containerPadding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  content: {
    padding: Spacing.containerPadding,
    paddingBottom: 160,
    gap: 16,
  },
  questionBubble: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 20,
    ...Shadows.card,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
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
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.statusGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
  },
  answerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 20,
    gap: 16,
    ...Shadows.card,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurface,
    lineHeight: 22,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  simplifiedCard: {
    backgroundColor: '#fffbeb',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 20,
  },
  simplifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  simplifiedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400e',
    letterSpacing: 1,
  },
  simplifiedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350f',
    lineHeight: 22,
  },
  followupSection: {
    gap: 8,
  },
  followupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
  },
  followupText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    gap: 10,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
  },
  listenBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  helpBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
