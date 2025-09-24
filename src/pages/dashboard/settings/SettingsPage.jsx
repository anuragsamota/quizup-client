import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { updateUserProfile, deleteUserAccount, fetchUserProfile } from '../../../utils/userApi';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../../contexts/MessageContext';

function SettingsPage() {
  const { token, logout } = useAuth();
  const { showMessage } = useMessage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      if (!token) return;
      try {
        const data = await fetchUserProfile(token);
        setName(data.name || '');
        setEmail(data.email || '');
      } catch (err) {
        showMessage('Failed to load profile', 'error');
      }
    }
    loadProfile();
    // eslint-disable-next-line
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(token, { name, email });
      showMessage('Profile updated successfully!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      await deleteUserAccount(token);
      logout();
      showMessage('Account deleted successfully.', 'success');
      navigate('/');
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="mb-8 text-base-content/70">Update your profile or delete your account.</p>

      {/* Profile Update Form */}
      <form className="bg-base-200 rounded-box p-6 shadow mb-10" onSubmit={handleSave}>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>

      {/* Delete Account Section */}
      <div className="bg-base-200 rounded-box p-6 shadow">
        <h2 className="text-xl font-semibold mb-2 text-error">Delete Account</h2>
        <p className="mb-4 text-base-content/70">This action is irreversible. All your data will be permanently deleted.</p>
        <button
          className="btn btn-error btn-outline w-full"
          type="button"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
