import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Language, UserProfile } from '../types';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Vidhaan',
    phone: '+91 98765 43210',
    preferredLanguage: 'Marathi',
    explanationStyle: 'Simple',
    notifications: true,
    isOnline: true,
  });

  const languages: Language[] = ['Marathi', 'Hindi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'English'];

  const settingsRows = [
    {
      icon: 'translate' as const,
      label: 'Language',
      value: profile.preferredLanguage,
      type: 'select',
    },
    {
      icon: 'text-short' as const,
      label: 'Explanation Style',
      value: profile.explanationStyle,
      type: 'select',
    },
    {
      icon: 'bell-outline' as const,
      label: 'Notifications',
      value: profile.notifications,
      type: 'toggle',
    },
    {
      icon: 'wifi' as const,
      label: 'Online Status',
      value: profile.isOnline,
      type: 'toggle',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={Typography.boldLabel}>Account</Text>
        <Text style={Typography.titleLg}>Profile</Text>
      </View>

      {/* Avatar Card */}
      <View style={styles.avatarCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.avatarInfo}>
          <Text style={styles.avatarName}>{profile.name}</Text>
          <Text style={styles.avatarPhone}>{profile.phone}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <MaterialCommunityIcons name="pencil" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.settingsCard}>
        <Text style={[Typography.boldLabel, { marginBottom: 12 }]}>PREFERENCES</Text>
        {settingsRows.map((row, idx) => (
          <View
            key={idx}
            style={[styles.settingsRow, idx < settingsRows.length - 1 && styles.settingsRowBorder]}
          >
            <View style={styles.settingsLeft}>
              <MaterialCommunityIcons name={row.icon} size={22} color={Colors.secondary} />
              <Text style={styles.settingsLabel}>{row.label}</Text>
            </View>
            {row.type === 'toggle' ? (
              <Switch
                value={row.value as boolean}
                onValueChange={(val) => {
                  if (row.label === 'Notifications') setProfile(p => ({ ...p, notifications: val }));
                  if (row.label === 'Online Status') setProfile(p => ({ ...p, isOnline: val }));
                }}
                trackColor={{ false: Colors.outlineVariant, true: Colors.secondaryContainer }}
                thumbColor={row.value ? Colors.secondary : Colors.outline}
              />
            ) : (
              <TouchableOpacity style={styles.settingsValue}>
                <Text style={styles.settingsValueText}>{row.value as string}</Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.outline} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <Text style={[Typography.boldLabel, { marginBottom: 12 }]}>YOUR ACTIVITY</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Languages</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionRow}>
          <MaterialCommunityIcons name="help-circle-outline" size={22} color={Colors.secondary} />
          <Text style={styles.actionText}>Help & Support</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.outline} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow}>
          <MaterialCommunityIcons name="information-outline" size={22} color={Colors.secondary} />
          <Text style={styles.actionText}>About Saarthi</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.outline} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 0 }]}>
          <MaterialCommunityIcons name="shield-check-outline" size={22} color={Colors.secondary} />
          <Text style={styles.actionText}>Privacy Policy</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.outline} />
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.versionText}>Saarthi v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.containerPadding, paddingBottom: 100, gap: 16 },
  header: { paddingTop: Spacing.lg },
  avatarCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.outlineVariant,
    padding: 20, ...Shadows.card,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: Colors.white },
  avatarInfo: { flex: 1 },
  avatarName: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  avatarPhone: { fontSize: 13, fontWeight: '500', color: Colors.outline, marginTop: 2 },
  editBtn: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: Colors.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  settingsCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, borderWidth: 1,
    borderColor: Colors.outlineVariant, padding: 20, ...Shadows.card,
  },
  settingsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingsLabel: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  settingsValue: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingsValueText: { fontSize: 13, fontWeight: '600', color: Colors.outline },
  statsCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, borderWidth: 1,
    borderColor: Colors.outlineVariant, padding: 20, ...Shadows.card,
  },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: 11, fontWeight: '700', color: Colors.outline, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  actionsCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, borderWidth: 1,
    borderColor: Colors.outlineVariant, padding: 20, ...Shadows.card,
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant,
  },
  actionText: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  versionText: { textAlign: 'center', fontSize: 12, fontWeight: '500', color: Colors.outline, marginTop: 8 },
});
