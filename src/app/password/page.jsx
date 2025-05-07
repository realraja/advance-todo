"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Globe, Trash2, Edit, Copy, Plus,
  Eye, EyeOff, Shield, ShieldOff, Undo2
} from "lucide-react";
import AddPasswordDialog from '@/components/dialog/addPasswordDialog';
import { useDeleteMutation, useGetAllQuery, useGetPasswordMutation, useSecurePasswordMutation } from '@/redux/api/password';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PasswordInputDialog from "@/components/dialog/InputPasswordDialog";
import EditPasswordDialog from "@/components/dialog/updatePasswordDialog";
import { useSelector } from "react-redux";
import PasswordGeneratorGuide from "@/components/introduction/password";

const PasswordPage = () => {
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState({});
  const [passwords, setPasswords] = useState([]);
  const [activeTab, setActiveTab] = useState('password');
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, password: null });
  const [revealedPasswords, setRevealedPasswords] = useState({});

  const {isUser} = useSelector(state => state.auth);

  const { data } = useGetAllQuery();
  const [getPassword] = useGetPasswordMutation();
  const [ToggleSecure] = useSecurePasswordMutation();
  const [ToggleDelete] = useDeleteMutation();

  useEffect(() => {
    if (data) setPasswords(data.data.password);
  }, [data]);

  const handleGetPassword = async (password) => {
    if (!revealedPasswords[password._id]) {
      const toastId = toast.loading('Decrypting password...');
      try {
        const res = await getPassword({ id: password._id,userPassword:password?.EnteredPassword });
        if (res.data?.success) {
          setRevealedPasswords(prev => ({ ...prev, [password._id]: res.data.data.password }));
          toast.success('Password revealed!', { id: toastId });
        } else {
          toast.error('Failed to decrypt password', { id: toastId });
        }
      } catch {
        toast.error('Error decrypting password', { id: toastId });
      }
    } else {
      setRevealedPasswords(prev => {
        const updated = { ...prev };
        delete updated[password._id];
        return updated;
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleContextMenu = (e, password) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY, password });
  };

  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, password: null });
  };

  const handleToggleSecurePassword = async (pass) => {
    const toastId = toast.loading(!pass.isSecure?'Securing Password...':'Security Removing...')
    const data = await ToggleSecure(pass._id);
    if(data?.data){
      toast.success(data.data.message,{id:toastId});
    }else{
      toast.error(data?.error?.data?.message,{id:toastId})
    }
  }

  const handleToggleDeletePassword = async (pass) => {
    const toastId = toast.loading(!pass.isDeleted?'Password Deleting...':'password Restoring...')
    const data = await ToggleDelete(pass._id);
    if(data?.data){
      toast.success(data.data.message,{id:toastId});
    }else{
      toast.error(data?.error?.data?.message,{id:toastId})
    }
  }

  const filteredPasswords = passwords.filter(p => {
    if (activeTab === 'password') return !p.isSecure && !p.isDeleted;
    if (activeTab === 'secured') return p.isSecure && !p.isDeleted;
    if (activeTab === 'deleted') return p.isDeleted;
  });

  if(!isUser) return <PasswordGeneratorGuide />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Password Vault
          </h1>
          <button
            onClick={() => setShowAddPassword(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg shadow-lg"
          >
            <Plus size={20} /> Add Password
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          {[
            { id: 'password', icon: Globe, label: 'Passwords' },
            { id: 'secured', icon: Lock, label: 'Secured' },
            { id: 'deleted', icon: Trash2, label: 'Deleted' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium flex items-center gap-2 relative ${activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
          ))}
        </div>

        {/* Passwords Grid */}
        <PasswordGride
          activeTab={activeTab}
          filteredPasswords={filteredPasswords}
          handleContextMenu={handleContextMenu}
          handleGetPassword={handleGetPassword}
          revealedPasswords={revealedPasswords}
          copyToClipboard={copyToClipboard}
        />
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.show && (
          <div
            className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1"
            style={{ top: contextMenu.y, left: contextMenu.x, minWidth: '180px' }}
            onClick={closeContextMenu}
          >
            {revealedPasswords[contextMenu.password._id] && <button onClick={()=> setShowEditPassword({...contextMenu.password,password:revealedPasswords[contextMenu.password._id]})} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"><Edit size={14} /> Edit</button>}
            {revealedPasswords[contextMenu.password._id] && <button onClick={()=> handleToggleSecurePassword(contextMenu.password)} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2">
              {contextMenu.password?.isSecure ? <ShieldOff size={14} /> : <Shield size={14} />}
              {contextMenu.password?.isSecure ? 'Remove Security' : 'Secure'}
            </button>}
            <button onClick={()=> handleToggleDeletePassword(contextMenu.password)}  className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2">
              {contextMenu.password?.isDeleted ? <Undo2 size={14} /> : <Trash2 size={14} />}
              {contextMenu.password?.isDeleted ? 'Restore' : 'Delete'}
            </button>
          </div>
        )}
      </AnimatePresence>
      {contextMenu.show && <div className="fixed inset-0 z-40" onClick={closeContextMenu} />}

      {showAddPassword && <AddPasswordDialog show={showAddPassword} setShow={setShowAddPassword} />}
      <EditPasswordDialog showData={showEditPassword} setShowData={setShowEditPassword} />
    </div>
  );
};

export default PasswordPage;

const PasswordGride = ({ filteredPasswords, activeTab, handleContextMenu, handleGetPassword, revealedPasswords, copyToClipboard }) => {
  const [showEnterPasswordDialog, setShowEnterPasswordDialog] = useState({})

  const handleShowPassword = (password) => {
    if(password.isSecure && !revealedPasswords[password._id]) return setShowEnterPasswordDialog(password)
    handleGetPassword(password)
  }

  return (
    <div>
      {filteredPasswords.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No {activeTab} passwords found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPasswords.map((password) => (
            <div
              key={password._id}
              onContextMenu={(e) => handleContextMenu(e, password)}
              className={`bg-gray-800/50 border rounded-xl p-4 shadow-lg relative group ${password.isDeleted ? 'border-red-500/30' : 'border-gray-700'}`}
            >
              {password.isDeleted && (
                <div className="absolute top-2 right-2 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Trash2 size={12} /> Deleted
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg truncate">{password.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${password.isSecure ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {password.isSecure ? 'Secured' : 'Public'}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleShowPassword(password)} className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600">
                  {revealedPasswords[password._id] ? <EyeOff size={16} className="text-blue-400" /> : <Eye size={16} className="text-gray-400" />}
                </button>
              </div>

              <div className="space-y-3">
                <InfoLine label="URL" value={password.url} onCopy={() => copyToClipboard(password.url)} />
                <InfoLine label="Username" value={password.username} onCopy={() => copyToClipboard(password.username)} />
                <InfoLine
                  label="Password"
                  value={revealedPasswords[password._id] || '••••••••'}
                  onCopy={() => copyToClipboard(revealedPasswords[password._id])}
                  disabled={!revealedPasswords[password._id]}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <PasswordInputDialog showData={showEnterPasswordDialog} setShowData={setShowEnterPasswordDialog} onSubmit={handleGetPassword} />
    </div>
  );
};

const InfoLine = ({ label, value, onCopy, disabled }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="text-sm truncate max-w-[120px]">{label === 'URL' ? <a className="text-blue-400 underline hover:text-blue-600" href={value} target="_blank">{value}</a> : value}</span>
        <button onClick={onCopy} className="p-1 rounded hover:bg-gray-700" disabled={disabled}>
          <Copy size={14} />
        </button>
      </div>
    </div>
  )
};
