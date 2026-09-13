import React from 'react';
import { Text, TextStyle } from 'react-native';
import { colors } from '../constants/theme';
import { formatCurrency } from '../utils/format';
import { TransactionType } from '../types';

interface Props {
  amount: number;
  type: TransactionType;
  symbol: string;
  size?: number;
  style?: TextStyle;
}

export default function AmountText({ amount, type, symbol, size = 16, style }: Props) {
  const sign = type === 'income' ? '+' : '-';
  const color = type === 'income' ? colors.income : colors.expense;
  return (
    <Text style={[{ color, fontSize: size, fontWeight: '700' }, style]}>
      {sign} {formatCurrency(Math.abs(amount), symbol)}
    </Text>
  );
}
