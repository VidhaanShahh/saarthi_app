import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { RootStackParamList } from '../types';

type RouteType = RouteProp<RootStackParamList, 'ListenAnswer'>;

export const ListenAnswerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const question = route.params.question;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const waveAnims = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0.3))
  ).current;

  const fullText = [
    question.summary,
    ...question.steps.map((s) => `Step ${s.number}: ${s.title}. ${s.description}`),
    question.simplifiedSummary || '',
  ].join('. ');

  useEffect(() => {
    startSpeaking();
    return () => { Speech.stop(); };
  }, []);

  useEffect(() => {
    if (isSpeaking) {
      const animations = waveAnims.map((anim, idx) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 300 + idx * 80,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 300 + idx * 80,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        )
      );
      animations.forEach((a) => a.start());
      return () => animations.forEach((a) => a.stop());
    }
  }, [isSpeaking]);

  // Simulate progress
  useEffect(() => {
    if (isSpeaking) {
      const duration = (question.audioDurationSeconds || 120) * 1000;
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) { clearInterval(interval); return 1; }
          return p + 100 / duration;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  const startSpeaking = () => {
    setIsSpeaking(true);
    setProgress(0);
    Speech.speak(fullText, {
      language: question.language === 'Hindi' ? 'hi-IN' : question.language === 'Marathi' ? 'mr-IN' : 'en-IN',
      rate: 0.85,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      startSpeaking();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const totalSec = question.audioDurationSeconds || 120;
  const currentSec = progress * totalSec;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { Speech.stop(); navigation.goBack(); }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>Audio Answer</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={Typography.boldHeadlineSm}>Listening to Answer</Text>
        <Text style={styles.questionText} numberOfLines={2}>{question.question}</Text>

        {/* Waveform */}
        <View style={styles.waveContainer}>
          {waveAnims.map((anim, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.waveBar,
                {
                  transform: [{ scaleY: anim }],
                  height: 40 + (idx % 3) * 15,
                },
              ]}
            />
          ))}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(currentSec)}</Text>
            <Text style={styles.timeText}>{question.audioDuration || formatTime(totalSec)}</Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn}>
            <MaterialCommunityIcons name="rewind-10" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} onPress={toggleSpeech}>
            <MaterialCommunityIcons
              name={isSpeaking ? 'pause' : 'play'}
              size={36}
              color={Colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <MaterialCommunityIcons name="fast-forward-10" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Source */}
        <View style={styles.sourceChip}>
          <MaterialCommunityIcons name="shield-check" size={14} color={Colors.secondary} />
          <Text style={styles.sourceText}>{question.verifiedSource || 'Official Source'}</Text>
        </View>
      </View>

      {/* Bottom */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.readBtn}
          onPress={() => {
            Speech.stop();
            navigation.goBack();
          }}
        >
          <MaterialCommunityIcons name="text" size={18} color={Colors.primary} />
          <Text style={styles.readBtnText}>Read Instead</Text>
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
  },
  backBtn: {
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
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.containerPadding,
    gap: 20,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.secondary,
    textAlign: 'center',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 80,
    marginVertical: 16,
  },
  waveBar: {
    width: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  progressContainer: {
    width: '100%',
    gap: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.outlineVariant,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.outline,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.mic,
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.statusGreen,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  bottomBar: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 16,
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
  },
  readBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
