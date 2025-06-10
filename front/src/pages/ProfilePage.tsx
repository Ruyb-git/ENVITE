import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import { Pencil, Camera } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newBio, setNewBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.patch('/api/v1/user/me/', { name: newName });
      updateUserProfile({ ...user!, name: newName });
      setIsNameModalOpen(false);
      toast.success('Name updated successfully');
    } catch (error) {
      toast.error('Failed to update name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBioUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.patch('/api/v1/user/me/', { bio: newBio });
      updateUserProfile({ ...user!, bio: newBio });
      setIsBioModalOpen(false);
      toast.success('Bio updated successfully');
    } catch (error) {
      toast.error('Failed to update bio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsLoading(true);
      const response = await api.patch('/api/v1/user/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateUserProfile({ ...user!, avatar: response.data.avatar });
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Profile Sidebar */}
            <div className="md:w-1/3 bg-gray-50 p-6 border-r border-gray-200">
              <div className="text-center">
                <div className="relative inline-block">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto bg-indigo-500 flex items-center justify-center text-white text-4xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Camera size={20} className="text-gray-600" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpdate}
                    disabled={isLoading}
                  />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {user?.name}
                    </h2>
                    <button
                      onClick={() => setIsNameModalOpen(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                  <p className="text-gray-500">@{user?.username}</p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-gray-600">{user?.bio || 'No bio yet'}</p>
                    <button
                      onClick={() => setIsBioModalOpen(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="md:w-2/3 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Username
                  </label>
                  <p className="mt-1 text-gray-900">{user?.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Name Modal */}
      <Modal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        title="Edit Name"
      >
        <form onSubmit={handleNameUpdate}>
          <Input
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter your name"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsNameModalOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Bio Modal */}
      <Modal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        title="Edit Bio"
      >
        <form onSubmit={handleBioUpdate}>
          <TextArea
            label="Bio"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Tell us about yourself"
            rows={4}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsBioModalOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default ProfilePage;