'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { AccountCard } from '@/components/account-card';
import { TransactionList } from '@/components/transaction-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Send, TrendingUp, Wallet } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockAccounts = [
  {
    id: '1',
    accountNumber: '1234567890123456',
    accountType: 'checking',
    balance: 5234.56,
    currency: 'USD',
    isPrimary: true,
  },
  {
    id: '2',
    accountNumber: '9876543210987654',
    accountType: 'savings',
    balance: 15000.00,
    currency: 'USD',
    isPrimary: false,
  },
];

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
];

export default function DashboardPage() {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <>
      <Navbar userEmail="john.doe@email.com" />
      <div className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${totalBalance.toFixed(2)}
                    </p>
                  </div>
                  <Wallet className="w-10 h-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Accounts</p>
                    <p className="text-3xl font-bold text-foreground">{accounts.length}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-accent opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recent Transactions</p>
                    <p className="text-3xl font-bold text-foreground">{transactions.length}</p>
                  </div>
                  <Send className="w-10 h-10 text-secondary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accounts */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Your Accounts</h2>
              <Link href="/dashboard/new-account">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Account
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {accounts.map((account) => (
                <AccountCard key={account.id} {...account} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Link href="/transfers">
              <Button variant="outline" className="w-full h-16 justify-start gap-3">
                <Send className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">Make a Transfer</p>
                  <p className="text-xs text-muted-foreground">Send money between accounts</p>
                </div>
              </Button>
            </Link>
            <Link href="/transactions">
              <Button variant="outline" className="w-full h-16 justify-start gap-3">
                <TrendingUp className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold text-foreground">View All Transactions</p>
                  <p className="text-xs text-muted-foreground">See your full transaction history</p>
                </div>
              </Button>
            </Link>
          </div>

          {/* Recent Transactions */}
          <TransactionList transactions={transactions} limit={5} />
        </div>
      </div>
    </>
  );
}
