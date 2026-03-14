'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Shield, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <>
      <Navbar userEmail="john.doe@email.com" />
      <div className="min-h-screen bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FieldGroup>
                        <FieldLabel className="text-sm">Full Name</FieldLabel>
                        <Input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </FieldGroup>
                      <FieldGroup>
                        <FieldLabel className="text-sm">Phone Number</FieldLabel>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </FieldGroup>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FieldGroup>
                        <FieldLabel className="text-sm">Address</FieldLabel>
                        <Input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </FieldGroup>
                      <FieldGroup>
                        <FieldLabel className="text-sm">City</FieldLabel>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </FieldGroup>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FieldGroup>
                        <FieldLabel className="text-sm">State</FieldLabel>
                        <Input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </FieldGroup>
                      <FieldGroup>
                        <FieldLabel className="text-sm">Postal Code</FieldLabel>
                        <Input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                        />
                      </FieldGroup>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        disabled={isSaving}
                        onClick={handleSave}
                        className="gap-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Full Name</p>
                      </div>
                      <p className="font-medium text-foreground">{formData.fullName}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                      <p className="font-medium text-foreground">{formData.email}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Phone</p>
                      </div>
                      <p className="font-medium text-foreground">{formData.phone}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Address</p>
                      </div>
                      <p className="font-medium text-foreground">
                        {formData.address}, {formData.city}, {formData.state} {formData.postalCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-foreground">Account Status</p>
                  <p className="text-xs text-muted-foreground">Your account is fully verified</p>
                </div>
                <Badge className="bg-accent text-accent-foreground">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-foreground">KYC Verification</p>
                  <p className="text-xs text-muted-foreground">Identity verification completed</p>
                </div>
                <Badge className="bg-accent text-accent-foreground">Verified</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">SMS and Email verification enabled</p>
                </div>
                <Badge className="bg-accent text-accent-foreground">Enabled</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Change Password</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your password to keep your account secure
                </p>
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="border-t border-destructive/20 pt-4">
                <h4 className="font-semibold text-foreground mb-2">Close Account</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently close your NextBank account and delete your data
                </p>
                <Button variant="destructive">Close Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
