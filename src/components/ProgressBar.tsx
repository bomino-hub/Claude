import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';

interface Props {
  progress: number; // 0..1+ (values above 1 render full and turn red)
  color?: string;
  height?: number;
}

export default function ProgressBar({ progress, color = colors.primary, height = 8 }: Props) {
  const safeProgress = Number.isFinite(progress) ? progress : 0;
  const pct = Math.max(0, Math.min(safeProgress, 1));
  const overBudget = safeProgress > 1;
  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${pct * 100}%`,
            backgroundColor: overBudget ? colors.danger : color,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: radius.full,
  },
});
