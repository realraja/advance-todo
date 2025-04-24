'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, Lock, Globe, ChevronRight, Loader2, Trash2, Edit2, Star, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddFolderDialog from '@/components/dialog/addImageFolderDialog';
import UpdateFolderDialog from '@/components/dialog/updateFolderDialog'; // Add this import
import { useGetAllQuery, useDeleteMutation } from '@/redux/api/photo';
import { format } from 'date-fns';

const FolderManager = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('public');
  const [folderData, setFolderData] = useState([]);
  const [showAddFolderDialog, setShowAddFolderDialog] = useState(false);
  const [showUpdateFolderDialog, setShowUpdateFolderDialog] = useState(false); // Add this state
  const [selectedFolder, setSelectedFolder] = useState(null); // Add this state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, folder: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const contextMenuRef = useRef(null);
  const [deleteFolder] = useDeleteMutation();

  const { data, refetch } = useGetAllQuery();

  useEffect(() => {
    if (!data) return;

    const filteredData = data.data.photo.filter((i) => {
      if (!i.isSecure && !i.isDeleted && activeTab === 'public') return true;
      if (i.isSecure && !i.isDeleted && activeTab === 'private') return true;
      if (i.isDeleted && activeTab === 'deleted') return true;
    });
    setFolderData(filteredData);
  }, [data, activeTab]);

  // Add this handler for edit
  const handleEdit = (folder) => {
    setSelectedFolder(folder);
    setShowUpdateFolderDialog(true);
  };

  const handleContextMenu = (e, folder) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      folder
    });
  };

  const handleDelete = async () => {
    if (!contextMenu.folder) return;
    setIsDeleting(true);
    try {
      await deleteFolder(contextMenu.folder._id).unwrap();
      await refetch();
    } catch (err) {
      console.error('Failed to delete folder:', err);
    } finally {
      setIsDeleting(false);
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const getRandomColor = () => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className=" p-4 sm:p-6 text-white relative">
      {/* Top Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            My Folders
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Organize and manage your notes or files
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddFolderDialog(true)}
          className="relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <FolderPlus size={18} /> 
          <span>Add Folder</span>
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex gap-2 sm:gap-4 mb-6"
      >
        {['public', 'private', 'deleted'].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border transition-all duration-300 flex items-center ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border-purple-500 text-white shadow-purple-glow'
                : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            {tab === 'public' ? (
              <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <Globe size={16} /> Public
              </span>
            ) : tab === 'private' ? (
              <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <Lock size={16} /> Private
              </span>
            ) : (
              <span className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                <Trash2 size={16} /> Deleted
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Folder Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {folderData.map((folder) => (
              <motion.div
                key={folder._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/image/${folder._id}`)}
                onContextMenu={(e) => handleContextMenu(e, folder)}
                className="cursor-pointer group relative overflow-hidden bg-gray-800/60 border border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/50"
              >
                <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${folder.color || getRandomColor()} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="text-lg font-semibold line-clamp-1 flex items-center gap-1">
                      {folder.isFavorite && <Star className="text-yellow-400 size-4" fill="currentColor" />}
                      {folder.name}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContextMenu(e, folder);
                      }}
                      className="p-1 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white transition"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400 capitalize px-2 py-1 rounded-full bg-gray-700/50">
                      {folder.isSecure ? 'Private' : 'Public'}
                    </span>
                    {folder.createdAt && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(folder.createdAt), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {folderData.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FolderPlus className="text-gray-500" size={40} />
          </div>
          <h3 className="text-xl font-medium text-gray-300 mb-1">
            No {activeTab} folders yet
          </h3>
          <p className="text-gray-500 max-w-md">
            {activeTab === 'public' 
              ? 'Create public folders to share with others' 
              : activeTab === 'private'
              ? 'Private folders are only visible to you'
              : 'No folders in trash'}
          </p>
          {activeTab !== 'deleted' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddFolderDialog(true)}
              className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow flex items-center gap-2"
            >
              <FolderPlus size={18} /> Create Folder
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div
            ref={contextMenuRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm"
            style={{
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
              transformOrigin: 'top left'
            }}
          >
            <div className="py-1 w-48">
              <motion.button
                whileHover={{ backgroundColor: 'rgba(107, 114, 128, 0.3)' }}
                onClick={() => {
                  handleEdit(contextMenu.folder);
                  setContextMenu({ ...contextMenu, visible: false });
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white flex items-center gap-2"
              >
                <Edit2 size={16} /> Edit
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} /> Delete
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Folder Dialog */}
      {showAddFolderDialog && (
        <AddFolderDialog 
          show={showAddFolderDialog} 
          setShow={setShowAddFolderDialog} 
          refetch={refetch}
        />
      )}

      {/* Update Folder Dialog */}
      {showUpdateFolderDialog && (
        <UpdateFolderDialog
          show={showUpdateFolderDialog}
          setShow={setShowUpdateFolderDialog}
          folderToUpdate={selectedFolder}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default FolderManager;