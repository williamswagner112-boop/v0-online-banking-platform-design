'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface AccountCardProps {
  accountId: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency?: string;
  isPrimary?: boolean;
}

export function AccountCard({
  accountId,
  accountNumber,
  accountType,
  balance,
  currency = 'USD',
  isPrimary = false,
}: AccountCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const maskAccountNumber = (num: string) => {
    return `•••• •••• •••• ${num.slice(-4)}`;
  };

  const getAccountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      checking: 'Checking Account',
      savings: 'Savings Account',
      money_market: 'Money Market',
    };
    return labels[type] || type;
  };

  return (
    <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{getAccountTypeLabel(accountType)}</CardTitle>
            {isPrimary && (
              <p className="text-xs font-semibold mt-1 opacity-90">Primary Account</p>
            )}
          </div>
          <CreditCard className="w-6 h-6" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs opacity-75 mb-1">Account Number</p>
            <p className="text-sm font-mono tracking-wider">{maskAccountNumber(accountNumber)}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs opacity-75">Available Balance</p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="hover:opacity-75 transition-opacity"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-2xl font-bold">
              {showBalance ? `${currency} ${balance.toFixed(2)}` : '••••••••'}
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
