'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  type: 'transfer_out' | 'transfer_in' | 'deposit' | 'withdrawal' | 'fee';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  merchant?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export function TransactionList({ transactions, limit = 5 }: TransactionListProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'transfer_out':
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-destructive" />;
      case 'transfer_in':
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-accent" />;
      case 'fee':
        return <TrendingDown className="w-5 h-5 text-muted-foreground" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getTransactionLabel = (type: string, merchant?: string) => {
    if (merchant) return merchant;
    const labels: Record<string, string> = {
      transfer_out: 'Transfer Sent',
      transfer_in: 'Transfer Received',
      deposit: 'Deposit',
      withdrawal: 'Withdrawal',
      fee: 'Bank Fee',
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, limit).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {getTransactionLabel(tx.type, tx.merchant)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    tx.type.includes('_out') || tx.type === 'withdrawal' ? 'text-destructive' : 'text-accent'
                  }`}>
                    {tx.type.includes('_out') || tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                </div>
                <Badge variant={getStatusColor(tx.status)} className="text-xs">
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
