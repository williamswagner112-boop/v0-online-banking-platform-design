'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

const mockAccounts = [
  { id: '1', name: 'Checking Account', number: '****7890', balance: 5234.56 },
  { id: '2', name: 'Savings Account', number: '****7654', balance: 15000.00 },
];

export default function TransfersPage() {
  const [fromAccount, setFromAccount] = useState('1');
  const [toAccount, setToAccount] = useState('2');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: toAccount,
          amount: parseFloat(amount),
          purpose,
        }),
      });

      if (!response.ok) {
        throw new Error('Transfer failed');
      }

      setSuccess(true);
      setAmount('');
      setPurpose('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFromAccount = mockAccounts.find((acc) => acc.id === fromAccount);
  const maxAmount = selectedFromAccount?.balance || 0;

  return (
    <>
      <Navbar userEmail="john.doe@email.com" />
      <div className="min-h-screen bg-muted/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Money Transfer</h1>
            <p className="text-muted-foreground">
              Send money between your accounts or to other recipients
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                New Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Transfer Initiated
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your transfer has been successfully created and is pending approval.
                  </p>
                  <Button
                    onClick={() => setSuccess(false)}
                    className="w-full"
                  >
                    Make Another Transfer
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <FieldGroup>
                    <FieldLabel>From Account</FieldLabel>
                    <Select value={fromAccount} onValueChange={setFromAccount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name} ({acc.number}) - ${acc.balance.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>To Account</FieldLabel>
                    <Select value={toAccount} onValueChange={setToAccount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts
                          .filter((acc) => acc.id !== fromAccount)
                          .map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              {acc.name} ({acc.number})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Amount (USD)</FieldLabel>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      max={maxAmount}
                      step="0.01"
                      min="0"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Available: ${maxAmount.toFixed(2)}
                    </p>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Transfer Purpose (Optional)</FieldLabel>
                    <Input
                      type="text"
                      placeholder="e.g., Monthly savings transfer"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </FieldGroup>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">Transfer Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium text-foreground">${parseFloat(amount || '0').toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transfer Type:</span>
                        <span className="font-medium text-foreground">Internal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium text-foreground">Pending</span>
                      </div>
                    </div>
                  </div>

                  <Button disabled={isLoading} size="lg" className="w-full gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confirm Transfer
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
