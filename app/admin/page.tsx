'use client';

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';

const mockStats = {
  totalUsers: 1247,
  activeAccounts: 2894,
  pendingTransfers: 23,
  totalVolume: 12450000,
  suspiciousActivities: 5,
};

const mockRecentTransfers = [
  {
    id: 'TRF001',
    from: 'John Doe',
    to: 'Jane Smith',
    amount: 5000,
    status: 'completed',
    riskLevel: 'low',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'TRF002',
    from: 'Robert Johnson',
    to: 'Alice Brown',
    amount: 25000,
    status: 'pending',
    riskLevel: 'high',
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: 'TRF003',
    from: 'Michael Lee',
    to: 'Sarah Davis',
    amount: 1500,
    status: 'completed',
    riskLevel: 'low',
    timestamp: new Date(Date.now() - 10800000),
  },
];

const mockFraudAlerts = [
  {
    id: 'FRAUD001',
    userId: 'user_123',
    userName: 'John Doe',
    alertType: 'Unusual Transaction Amount',
    amount: 50000,
    status: 'pending_review',
    severity: 'critical',
  },
  {
    id: 'FRAUD002',
    userId: 'user_456',
    userName: 'Jane Smith',
    alertType: 'Rapid Consecutive Transfers',
    amount: 15000,
    status: 'resolved',
    severity: 'high',
  },
  {
    id: 'FRAUD003',
    userId: 'user_789',
    userName: 'Bob Wilson',
    alertType: 'New Device Login',
    amount: 0,
    status: 'pending_review',
    severity: 'medium',
  },
];

export default function AdminPage() {
  return (
    <>
      <Navbar userEmail="admin@nextbank.com" />
      <div className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform analytics and management</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              {
                icon: Users,
                label: 'Total Users',
                value: mockStats.totalUsers.toLocaleString(),
                color: 'text-primary',
              },
              {
                icon: CreditCard,
                label: 'Active Accounts',
                value: mockStats.activeAccounts.toLocaleString(),
                color: 'text-accent',
              },
              {
                icon: Clock,
                label: 'Pending Transfers',
                value: mockStats.pendingTransfers,
                color: 'text-secondary',
              },
              {
                icon: DollarSign,
                label: 'Total Volume',
                value: `$${(mockStats.totalVolume / 1000000).toFixed(1)}M`,
                color: 'text-primary',
              },
              {
                icon: AlertTriangle,
                label: 'Suspicious Activity',
                value: mockStats.suspiciousActivities,
                color: 'text-destructive',
              },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Card key={idx} className="border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                        <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${metric.color} opacity-20`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Transfers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentTransfers.map((transfer) => (
                    <div key={transfer.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">
                          {transfer.from} → {transfer.to}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transfer.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-foreground">
                          ${transfer.amount.toLocaleString()}
                        </p>
                        <div className="flex gap-2 justify-end mt-1">
                          <Badge
                            variant={transfer.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {transfer.status}
                          </Badge>
                          <Badge
                            variant={transfer.riskLevel === 'low' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {transfer.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fraud Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Fraud Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFraudAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">
                            {alert.userName}
                          </p>
                          <p className="text-xs text-muted-foreground">{alert.alertType}</p>
                        </div>
                        <Badge
                          variant={
                            alert.severity === 'critical'
                              ? 'destructive'
                              : alert.severity === 'high'
                                ? 'secondary'
                                : 'outline'
                          }
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                          {alert.amount > 0 && `$${alert.amount.toLocaleString()}`}
                        </div>
                        {alert.status === 'pending_review' ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Review
                          </Button>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-accent">
                            <CheckCircle className="w-4 h-4" />
                            Resolved
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Database Performance</p>
                    <Badge className="bg-accent text-accent-foreground">98%</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">API Response Time</p>
                    <Badge className="bg-accent text-accent-foreground">45ms</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Security Score</p>
                    <Badge className="bg-accent text-accent-foreground">A+</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
