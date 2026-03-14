'use client';

import { Navbar } from '@/components/navbar';
import { TransactionList } from '@/components/transaction-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const mockTransactions = [
  {
    id: '1',
    type: 'transfer_out' as const,
    amount: 500,
    description: 'Transfer to John Smith',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    merchant: 'John Smith',
  },
  {
    id: '2',
    type: 'deposit' as const,
    amount: 2000,
    description: 'Direct deposit',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    merchant: 'Employer Inc.',
  },
  {
    id: '3',
    type: 'withdrawal' as const,
    amount: 200,
    description: 'ATM Withdrawal',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    type: 'transfer_in' as const,
    amount: 1500,
    description: 'Transfer from Sarah',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    merchant: 'Sarah Johnson',
  },
  {
    id: '5',
    type: 'fee' as const,
    amount: 5,
    description: 'Monthly maintenance fee',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '6',
    type: 'deposit' as const,
    amount: 1000,
    description: 'Deposit',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    merchant: 'Manual Deposit',
  },
];

export default function TransactionsPage() {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  let filtered = mockTransactions;

  if (selectedStatus !== 'all') {
    filtered = filtered.filter((tx) => tx.status === selectedStatus);
  }

  return (
    <>
      <Navbar userEmail="john.doe@email.com" />
      <div className="min-h-screen bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Transaction History</h1>
            <p className="text-muted-foreground">View and manage all your transactions</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Account</label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      <SelectItem value="checking">Checking Account</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtered.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{tx.merchant || tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${
                        tx.type.includes('_out') || tx.type === 'withdrawal'
                          ? 'text-destructive'
                          : 'text-accent'
                      }`}>
                        {tx.type.includes('_out') || tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
