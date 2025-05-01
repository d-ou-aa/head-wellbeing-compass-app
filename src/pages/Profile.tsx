
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Edit, Bell, Shield, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [username, setUsername] = useState('Anonymous User');
  const [bio, setBio] = useState('');

  // Handle edit profile submission
  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this to a database
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditProfileOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    // In a real app with authentication, you would clear the session here
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    // Redirect to home page after logout
    navigate('/');
  };

  // Navigate to specific pages
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout pageTitle="Profile">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4 pb-6">
          <div className="w-24 h-24 rounded-full bg-teal/10 flex items-center justify-center">
            <User className="w-12 h-12 text-teal" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{username}</h2>
            <p className="text-gray-500 text-sm">Joined April 2023</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsEditProfileOpen(true)}
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        <Card className="p-4">
          <h3 className="font-medium mb-4">Account Settings</h3>
          
          <div className="space-y-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => navigateTo('/notifications')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-lightest flex items-center justify-center">
                  <Bell className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-gray-500">Manage notification preferences</p>
                </div>
              </div>
              <div className="text-teal">→</div>
            </div>
            
            <Separator />
            
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => navigateTo('/settings')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-lightest flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h4 className="font-medium">Privacy & Security</h4>
                  <p className="text-sm text-gray-500">Control your data and security options</p>
                </div>
              </div>
              <div className="text-teal">→</div>
            </div>
            
            <Separator />
            
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-medium text-red-500">Log Out</h4>
                  <p className="text-sm text-gray-500">Sign out of your account</p>
                </div>
              </div>
              <div className="text-teal">→</div>
            </div>
          </div>
        </Card>
        
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>App version 1.0.0</p>
          <p>© 2023 HeadDoWell. All rights reserved.</p>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditProfileSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Display Name</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Profile;
