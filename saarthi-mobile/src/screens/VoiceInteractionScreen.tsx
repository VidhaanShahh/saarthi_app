import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { QuestionItem, RootStackParamList, Language } from '../types';
import { askSaarthi } from '../api/client';

type NavProp = StackNavigationProp<RootStackParamList>;

export const VoiceInteractionScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const insets = useSafeAreaInsets();
  const [isListening, setIsListening] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [resultQuestion, setResultQuestion] = useState<QuestionItem | null>(null);
  const selectedLanguage: Language = 'Marathi';

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pingAnim = useRef(new Animated.Value(0)).current;

  const presets = [
    'How to file an FIR at nearest police station?',
    'How to check PM Kisan application status?',
    'How to apply for 7/12 land extract online?',
  ];

  useEffect(() => {
    if (isListening) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
      const ping = Animated.loop(
        Animated.sequence([
          Animated.timing(pingAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(pingAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
      pulse.start();
      ping.start();
      return () => { pulse.stop(); ping.stop(); };
    }
  }, [isListening]);

  // Auto-fill after 3s if no input
  useEffect(() => {
    if (isListening && !inputText) {
      const t = setTimeout(() => setInputText(presets[0]), 3000);
      return () => clearTimeout(t);
    }
  }, [isListening]);

  const handleProcessQuestion = async (queryText?: string) => {
    const prompt = queryText || inputText || presets[0];
    setIsListening(false);
    setIsProcessing(true);

    try {
      const data = await askSaarthi(prompt, selectedLanguage);
      const newQ: QuestionItem = {
        id: `q-${Date.now()}`,
        question: prompt,
        date: 'Today',
        timestamp: Date.now(),
        language: selectedLanguage,
        sourceType: 'APP',
        starred: false,
        category: 'Legal',
        verifiedSource: data.verifiedSource || 'Official Government Source',
        summary: data.summary || 'Official step-by-step guidance provided by Saarthi.',
        steps: data.steps || [
          { number: 1, title: 'Visit Designated Office', description: 'Go to nearest station or official government portal.' },
          { number: 2, title: 'Provide Statement & Documents', description: 'Narrate facts accurately and attach identity proof.' },
          { number: 3, title: 'Obtain Stamped Acknowledgement', description: 'Always demand official free receipt or copy.' },
        ],
        simplifiedSummary: data.simplifiedSummary || 'Visit official office, state details clearly, and obtain stamped acknowledgement.',
        followups: data.followups || ['Can I do it online?', 'What if officer refuses?'],
        audioDuration: '2:15',
        audioDurationSeconds: 135,
      };
      setResultQuestion(newQ);
    } catch (e) {
      // Fallback
      const fallback: QuestionItem = {
        id: `q-${Date.now()}`,
        question: prompt,
        date: 'Today',
        timestamp: Date.now(),
        language: selectedLanguage,
        sourceType: 'APP',
        starred: false,
        category: 'Legal',
        verifiedSource: 'Official Government Portal',
        summary: `Official Guidance for: ${prompt}`,
        steps: [
          { number: 1, title: 'Visit Designated Office', description: 'Go to nearest station or official government portal.' },
          { number: 2, title: 'Provide Statement & Documents', description: 'Narrate facts accurately and attach identity proof.' },
          { number: 3, title: 'Obtain Stamped Acknowledgement', description: 'Always demand official free receipt or copy.' },
        ],
        simplifiedSummary: 'Visit official office or portal, state details clearly, and obtain stamped acknowledgement copy.',
        followups: ['Can I do it online?', 'What if officer refuses?'],
        audioDuration: '1:45',
      };
      setResultQuestion(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      handleProcessQuestion(inputText || presets[0]);
    } else {
      setIsListening(true);
      setInputText('');
      setResultQuestion(null);
    }
  };

  const pingScale = pingAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] });
  const pingOpacity = pingAnim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.6, 0, 0] });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>Voice Assistant</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Canvas */}
      <View style={styles.mainCanvas}>
        <Text style={Typography.boldHeadlineSm}>Tell Saarthi what happened</Text>
        <Text style={styles.feedbackText}>
          {isProcessing
            ? 'Finding a trusted answer...'
            : isListening
              ? inputText ? `"${inputText}"` : 'Listening for your voice...'
              : resultQuestion
                ? 'Answer Ready!'
                : 'Tap mic to start speaking'}
        </Text>

        {/* Preset Chips */}
        {!isProcessing && !resultQuestion && (
          <View style={styles.presetsRow}>
            {presets.map((preset, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.presetChip}
                onPress={() => { setInputText(preset); handleProcessQuestion(preset); }}
              >
                <MaterialCommunityIcons name="account-voice" size={14} color={Colors.secondary} />
                <Text style={styles.presetChipText} numberOfLines={1}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Type Input */}
        {!isProcessing && (
          showTypeInput ? (
            <View style={styles.typeRow}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your question..."
                placeholderTextColor={Colors.outline}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={() => handleProcessQuestion(inputText)}>
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.typeToggle} onPress={() => setShowTypeInput(true)}>
              <MaterialCommunityIcons name="keyboard" size={16} color={Colors.outline} />
              <Text style={styles.typeToggleText}>TYPE QUESTION INSTEAD</Text>
            </TouchableOpacity>
          )
        )}

        {/* Mic Orb */}
        <View style={styles.micContainer}>
          {isListening && (
            <>
              <Animated.View style={[styles.pingRing, { transform: [{ scale: pingScale }], opacity: pingOpacity }]} />
              <Animated.View style={[styles.outerRing, { transform: [{ scale: pulseAnim }] }]} />
            </>
          )}
          <TouchableOpacity
            style={[styles.micOrb, isProcessing && styles.micOrbProcessing]}
            onPress={handleMicClick}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color={Colors.white} />
            ) : (
              <MaterialCommunityIcons name="microphone" size={56} color={Colors.white} />
            )}
            <Text style={styles.micLabel}>
              {isProcessing ? 'Processing' : isListening ? 'Tap to Submit' : 'Tap to Speak'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        {/* Feedback Card */}
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackIcon}>
            <MaterialCommunityIcons
              name={isProcessing ? 'head-lightbulb' : resultQuestion ? 'check-decagram' : 'microphone'}
              size={20}
              color={Colors.white}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.feedbackCardTitle} numberOfLines={1}>
              {isProcessing
                ? 'Finding verified official answer...'
                : resultQuestion
                  ? resultQuestion.question
                  : inputText || 'Tap mic or select a question above'}
            </Text>
            <Text style={styles.feedbackCardSub} numberOfLines={1}>
              {resultQuestion ? resultQuestion.verifiedSource : 'Verified Government Legal Engine'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            if (resultQuestion) {
              navigation.navigate('ListenAnswer', { question: resultQuestion });
            } else {
              handleProcessQuestion();
            }
          }}
        >
          <MaterialCommunityIcons name="volume-high" size={20} color={Colors.white} />
          <Text style={styles.primaryBtnText}>Listen Response</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => {
              if (resultQuestion) navigation.navigate('ConversationDetail', { question: resultQuestion });
              else handleProcessQuestion();
            }}
          >
            <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.onSurface} />
            <Text style={styles.outlineBtnText}>Explain Simpler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => {
              if (resultQuestion) navigation.navigate('ConversationDetail', { question: resultQuestion });
              else handleProcessQuestion();
            }}
          >
            <MaterialCommunityIcons name="text" size={18} color={Colors.onSurface} />
            <Text style={styles.outlineBtnText}>Read Answer</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    backgroundColor: Colors.statusGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.statusGreenText,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainCanvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.containerPadding,
    paddingBottom: 100,
  },
  feedbackText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.secondary,
    marginTop: 8,
    textAlign: 'center',
    minHeight: 28,
  },
  presetsRow: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    ...Shadows.card,
    maxWidth: '90%',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    flexShrink: 1,
  },
  typeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  typeToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.outline,
    letterSpacing: 1,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    width: '100%',
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    width: 180,
    height: 180,
  },
  pingRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.secondary,
  },
  outerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: Colors.secondary,
    opacity: 0.3,
  },
  micOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.mic,
    zIndex: 10,
  },
  micOrbProcessing: {
    backgroundColor: Colors.primary,
  },
  micLabel: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
    opacity: 0.9,
  },
  bottomActions: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 16,
    gap: 12,
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 16,
    gap: 12,
    ...Shadows.card,
  },
  feedbackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  feedbackCardSub: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
});
