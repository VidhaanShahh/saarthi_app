import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { RootStackParamList } from '../types';

type RouteType = RouteProp<RootStackParamList, 'HumanHelp'>;

export const HumanHelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const question = route.params?.question;

  const helpOptions = [
    {
      icon: 'phone' as const,
      title: 'Legal Aid Helpline',
      subtitle: 'Free government legal assistance',
      number: '15100',
      color: Colors.secondary,
    },
    {
      icon: 'shield-account' as const,
      title: 'Women Helpline',
      subtitle: 'National Commission for Women',
      number: '1091',
      color: '#7c3aed',
    },
    {
      icon: 'police-badge' as const,
      title: 'Police Helpline',
      subtitle: 'National emergency number',
      number: '100',
      color: Colors.error,
    },
    {
      icon: 'web' as const,
      title: 'Cyber Crime Portal',
      subtitle: 'Report online fraud & cyber crime',
      number: '1930',
      color: '#00405c',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Get Human Help</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="hand-heart" size={40} color={Colors.white} />
          </View>
          <Text style={Typography.titleLg}>Talk to a Real Person</Text>
          <Text style={styles.heroSubtitle}>
            Sometimes you need human guidance. Connect with verified helplines and legal aid services.
          </Text>
        </View>

        {question && (
          <View style={styles.contextCard}>
            <MaterialCommunityIcons name="information" size={18} color={Colors.secondary} />
            <Text style={styles.contextText}>
              Regarding: "{question.question}"
            </Text>
          </View>
        )}

        {/* Help Options */}
        {helpOptions.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.helpCard}
            activeOpacity={0.7}
            onPress={() => Linking.openURL(`tel:${opt.number}`)}
          >
            <View style={[styles.helpIcon, { backgroundColor: opt.color }]}>
              <MaterialCommunityIcons name={opt.icon} size={24} color={Colors.white} />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>{opt.title}</Text>
              <Text style={styles.helpSubtitle}>{opt.subtitle}</Text>
            </View>
            <View style={styles.callBadge}>
              <MaterialCommunityIcons name="phone" size={16} color={Colors.white} />
              <Text style={styles.callNumber}>{opt.number}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <MaterialCommunityIcons name="shield-check" size={16} color={Colors.outline} />
          <Text style={styles.disclaimerText}>
            All helplines are verified official government services. Calls are free from most networks.
          </Text>
        </View>
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
  content: { padding: Spacing.containerPadding, paddingBottom: 40, gap: 14 },
  heroCard: {
    alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.outlineVariant, padding: 28, gap: 12, ...Shadows.card,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  heroSubtitle: { fontSize: 13, fontWeight: '500', color: Colors.outline, textAlign: 'center', lineHeight: 20 },
  contextCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.statusGreen,
    padding: 14, borderRadius: BorderRadius.lg,
  },
  contextText: { fontSize: 13, fontWeight: '600', color: Colors.secondary, flex: 1 },
  helpCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.outlineVariant,
    padding: 16, ...Shadows.card,
  },
  helpIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  helpContent: { flex: 1 },
  helpTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  helpSubtitle: { fontSize: 12, fontWeight: '500', color: Colors.outline, marginTop: 2 },
  callBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.secondary,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full,
  },
  callNumber: { fontSize: 13, fontWeight: '700', color: Colors.white },
  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 8,
  },
  disclaimerText: { fontSize: 11, fontWeight: '500', color: Colors.outline, flex: 1, lineHeight: 16 },
});
