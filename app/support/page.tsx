'use client';

import { Navbar } from '@/components/navbar';
import { SupportTicketForm } from '@/components/support-ticket-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const mockTickets = [
  {
    id: 'TKT001',
    subject: 'Transfer not received',
    category: 'transaction_issue',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000),
    resolutionNote: 'Transfer was successfully received. Please check your receiving account balance.',
  },
  {
    id: 'TKT002',
    subject: 'Cannot login to account',
    category: 'account_issue',
    status: 'in_progress',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    id: 'TKT003',
    subject: 'Request for account limit increase',
    category: 'feature_request',
    status: 'open',
    priority: 'normal',
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 4),
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'tickets'>('create');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-accent" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-primary" />;
      case 'open':
        return <AlertCircle className="w-4 h-4 text-secondary" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'open':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'normal':
        return 'default';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Navbar userEmail="john.doe@email.com" />
      <div className="min-h-screen bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Customer Support</h1>
            <p className="text-muted-foreground">
              Get help with your account or create a new support ticket
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              Create Ticket
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
            >
              My Tickets
            </button>
          </div>

          {/* Create Ticket Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <SupportTicketForm />
              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      How long does a transfer take?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Internal transfers between NextBank accounts are processed instantly.
                      External transfers may take 1-3 business days depending on the recipient bank.
                    </p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      Is my account secure?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, we use bank-level encryption (AES-256), two-factor authentication, and
                      continuous fraud monitoring to protect your account.
                    </p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold text-foreground mb-2">
                      What is the daily transfer limit?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The default daily transfer limit is $50,000. You can request to increase this
                      limit through your account settings or by contacting support.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {mockTickets.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No support tickets yet</p>
                  </CardContent>
                </Card>
              ) : (
                mockTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-muted-foreground">
                              {ticket.id}
                            </span>
                            <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                              {ticket.priority}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-foreground">{ticket.subject}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Category: {ticket.category.replace(/_/g, ' ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <Badge variant={getStatusColor(ticket.status)} className="text-xs">
                            {ticket.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      </div>

                      {ticket.resolutionNote && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm text-foreground">
                          <p className="font-medium mb-1">Resolution:</p>
                          <p className="text-muted-foreground">{ticket.resolutionNote}</p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-3">
                        Created {new Date(ticket.createdAt).toLocaleDateString()} •
                        Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
