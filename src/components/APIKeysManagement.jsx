import React, { useState, useEffect } from 'react';
import { Plus, Key, CheckCircle, XCircle } from 'lucide-react';
import { activateKey, apikeySave, getKeys } from '../services/resumeService';

export default function APIKeysManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [apiKeys, setApiKeys] = useState([
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState({
    key: '',
    tokens: '',
    requests: ''
  });

  const correctPin =  "987654"; // Default for demo

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === correctPin) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  const handleSetActive =async (apikeys) => {

    const key={
      apikey: apikeys.apikey,
      active: true
    }
    const response=await activateKey(key);
    console.log("response",response)
  };

  const handleAddKey = () => {
    if (!newKey.key || !newKey.tokens || !newKey.requests) {
      alert('Please fill in all fields');
      return;
    }

    const key = {
      apikey: newKey.key,
      tokens: parseInt(newKey.tokens),
      requests: parseInt(newKey.requests),
      active: false
    };
    const save=apikeySave(key)

    setApiKeys([...apiKeys, key]);
    setNewKey({ key: '', tokens: '', requests: '' });
    setShowAddModal(false);
  };
  const getKeysData=async ()=>{
    const result = await getKeys();
   console.log("result",result)
   setApiKeys(result.data)
  }

  useEffect(() => {
   getKeysData();
  },[])





  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark flex items-center justify-center p-4">
        <div className="bg-surface-dark-light rounded-card p-8 shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <Key className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h2 className="text-heading font-bold text-text-primary mb-2">Enter PIN</h2>
            <p className="text-text-muted text-body-small">Enter your 6-digit PIN to access API keys management</p>
          </div>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 bg-surface-dark border border-border-primary rounded-button text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
            {pinError && (
              <p className="text-red-400 text-sm mt-2 text-center">{pinError}</p>
            )}
            <button
              type="submit"
              className="w-full mt-6 bg-brand-primary text-text-primary px-6 py-3 rounded-button font-semibold hover:bg-brand-primary-hover transition-all transform hover:scale-105"
            >
              Verify PIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-dark-mid to-brand-secondary-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-heading font-bold text-text-primary mb-2">API Keys Management</h1>
            <p className="text-text-muted text-body-small">Manage your API keys, monitor usage, and set active keys</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-primary text-text-primary px-6 py-3 rounded-button font-semibold hover:bg-brand-primary-hover transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Key
          </button>
        </div>

        {/* API Keys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="bg-surface-dark-light rounded-card p-6 shadow-lg border border-border-primary hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-brand-primary" />
                    <span className="text-text-primary font-semibold">API Key</span>
                  </div>
                  <p className="text-text-secondary font-mono text-sm bg-surface-dark px-3 py-2 rounded-button break-all">
                    {key.apikey}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-button text-xs font-semibold ${
                  key.active
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {key.active ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle size={12} />
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <XCircle size={12} />
                      Inactive
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-muted text-sm">Tokens Used</span>
                  <span className="text-text-primary font-semibold">{key?.tokens?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted text-sm">Requests Made</span>
                  <span className="text-text-primary font-semibold">{key?.requests?.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleSetActive(key)}
                disabled={key.active}
                className={`w-full py-2 rounded-button font-semibold transition-all ${
                  key.active
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-brand-secondary text-text-primary hover:bg-brand-secondary-dark transform hover:scale-105'
                }`}
              >
                {key.active ? 'Currently Active' : 'Set Active'}
              </button>
            </div>
          ))}
        </div>

        {/* Add New Key Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface-dark-light rounded-card p-6 shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold text-text-primary mb-4">Add New API Key</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary text-sm font-semibold mb-2">API Key</label>
                  <input
                    type="text"
                    value={newKey.key}
                    onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-dark border border-border-primary rounded-button text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    placeholder="sk-..."
                  />
                </div>

                <div>
                  <label className="block text-text-secondary text-sm font-semibold mb-2">Tokens</label>
                  <input
                    type="number"
                    value={newKey.tokens}
                    onChange={(e) => setNewKey({...newKey, tokens: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-dark border border-border-primary rounded-button text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-text-secondary text-sm font-semibold mb-2">Requests</label>
                  <input
                    type="number"
                    value={newKey.requests}
                    onChange={(e) => setNewKey({...newKey, requests: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-dark border border-border-primary rounded-button text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600 text-text-primary px-4 py-3 rounded-button font-semibold hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddKey}
                  className="flex-1 bg-brand-primary text-text-primary px-4 py-3 rounded-button font-semibold hover:bg-brand-primary-hover transition-all transform hover:scale-105"
                >
                  Add Key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
