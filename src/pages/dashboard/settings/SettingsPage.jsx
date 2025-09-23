
import React, { useState } from 'react';

function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Placeholder handlers
  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Implement save logic
  };

  const handleDelete = () => {
    // TODO: Implement delete logic
    setShowDeleteModal(false);
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
        <button type="submit" className="btn btn-primary w-full">Save Changes</button>
      </form>

      {/* Delete Account Section */}
      <div className="bg-base-200 rounded-box p-6 shadow">
        <h2 className="text-xl font-semibold mb-2 text-error">Delete Account</h2>
        <p className="mb-4 text-base-content/70">This action is irreversible. All your data will be permanently deleted.</p>
        <button
          className="btn btn-error btn-outline w-full"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="modal-box bg-base-100">
            <h3 className="font-bold text-lg text-error mb-2">Confirm Account Deletion</h3>
            <p className="mb-4">Are you sure you want to delete your account? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-error" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
