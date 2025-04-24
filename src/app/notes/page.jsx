"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Plus, Search, NotebookPen, Bookmark, Star, Trash2, Info, Edit, Calendar, PlusCircle } from "lucide-react";
import AddNoteFormDialog from "@/components/dialog/addNoteDialog";
import { useFavoriteMutation, useGetAllQuery } from "@/redux/api/diary";
import UpdateNoteDialog from "@/components/dialog/updateNoteDialog";
import NoteDetailView from "@/components/dialog/detailDeleteNoteDialog";
import Link from "next/link";
import NotesIntroduction from "@/components/introduction/notes";
// import { GoalPage } from "@/components/goal/goal";





const NotesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddNote, setShowAddNote] = useState(false)

  const {isUser} = useSelector(state => state.auth);

  
  if(!isUser) return <NotesIntroduction />

  return (
    <div className="min-h-screen  p-4 md:p-8">
      {/* Beautiful Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Notes Hub
        </h1>
        <p className="text-gray-400 mt-2">
          Capture, organize and access your thoughts effortlessly
        </p>
      </motion.header>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-500 size-5" />
          </div>
          <input
            type="text"
            className="w-full bg-gray-800/70 text-white rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <motion.button
          onClick={() => setShowAddNote(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="size-5" />
          New Note
        </motion.button>
      </motion.div>

      {/* Notes Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-8"
      >
        <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
          {[
            { id: "all", icon: <NotebookPen className="size-4" />, label: "All" },
            { id: "diary", icon: <Bookmark className="size-4" />, label: "Diary" },
            { id: "filling", icon: <Bookmark className="size-4" />, label: "Fill" },
            { id: "favorites", icon: <Star className="size-4" />, label: "Favorites" },
            { id: "deleted", icon: <Trash2 className="size-4" />, label: "Trash" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                ? "text-white"
                : "text-gray-400 hover:text-white"
                }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="notesTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notes Grid */}
      <Notes activeTab={activeTab} searchQuery={searchQuery} />

      {/* Empty State */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-12"
      >
        <NotebookPen className="mx-auto size-12 text-gray-600 mb-4" />
        <h3 className="text-xl font-medium text-gray-300 mb-2">No notes found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Create your first note by clicking the "New Note" button above
        </p>
      </motion.div> */}

      {showAddNote && <AddNoteFormDialog show={showAddNote} setShow={setShowAddNote} />}
    </div>
  );
};

export default NotesPage;



const Notes = ({ activeTab, searchQuery }) => {
  const [noteData, setNoteData] = useState([]);
  const [showEditingNote, setShowEditingNote] = useState({});
  const [showViewDetail, setShowViewDetail] = useState({})


  const { data } = useGetAllQuery();
  const [ToggleFavorite] = useFavoriteMutation();

  useEffect(() => {
    if (!data?.data?.diary) return;

    const query = searchQuery?.toLowerCase() || "";

    const filtered = data.data.diary.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      return title.includes(query) || description.includes(query);
    });

    const activeTabFilter = filtered.filter((i) => {
      if (activeTab === 'all'  && !i.isDeleted) return true;
      if (i.isFavorite && activeTab === 'favorites' && !i.isDeleted) return true;
      if (i.isDeleted && activeTab === 'deleted') return true;

      return i.type === activeTab && !i.isDeleted;
    });

    setNoteData(activeTabFilter);
  }, [searchQuery, activeTab, data?.data?.diary?.length]);

  const handleFavorite = async (id) => {
    setNoteData((prev) => {
      return prev.map((note) => {
        if (note._id === id) {
          return { ...note, isFavorite: !note.isFavorite };
        }
        return note;
      })
    });
    await ToggleFavorite(id);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (noteData.length < 1) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-center py-12"
    >
      <NotebookPen className="mx-auto size-12 text-gray-600 mb-4" />
      <h3 className="text-xl font-medium text-gray-300 mb-2">No notes found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Create your first note by clicking the "New Note" button above
      </p>
    </motion.div>
  )


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {noteData.map((note) => (
        <motion.div
          key={note._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.1)"
          }}
          className={`relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border transition-all cursor-pointer
            ${note.isFavorite ? 'border-yellow-500/30' : 'border-gray-700/50'}
            hover:border-purple-500/30 group overflow-hidden`}
        >
          {/* Favorite Ribbon */}
          {note.isFavorite && (
            <motion.div
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: -45, opacity: 1 }}
              className="absolute -right-10 -top-2 w-32 bg-gradient-to-r from-yellow-500 to-yellow-600 text-center text-white text-xs py-1"
              style={{ transformOrigin: 'center' }}
            >
              <Star className="size-3 inline-block mr-1" />
              Favorite
            </motion.div>
          )}

          {/* Note Header */}
          <div className="flex justify-between items-start mb-3">
            <div onClick={()=> setShowViewDetail(note)} className="flex gap-3 items-center">
              {note.imgUrl?.length > 0 ? (
                <motion.img
                  src={note.imgUrl[0]}
                  className="size-8 rounded-full object-cover border-2 border-purple-500/50"
                  whileHover={{ scale: 1.1 }}
                  alt="Note preview"
                />
              ) : (
                <div className="size-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <NotebookPen className="size-4 text-purple-400" />
                </div>
              )}
              <h3 className="font-medium text-white line-clamp-1">
                {note.title}
              </h3>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite(note._id);
                }}
                className={`p-1 rounded-full ${note.isFavorite ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 hover:text-yellow-400'}`}
              >
                <Star className="size-5" fill={note.isFavorite ? 'currentColor' : 'none'} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditingNote(note);
                }}
                className="p-1 rounded-full text-gray-400 hover:text-purple-400"
              >
                <Edit className="size-5" />
              </motion.button>
            </div>
          </div>

          {/* Note Content */}
          <motion.p
            className="text-gray-400 text-sm mb-4 line-clamp-3"
            whileHover={{ color: "#e2e8f0" }}
          >
            {note.content}
          </motion.p>

          {/* Note Footer */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="size-3" />
              <span>{formatDate(note.forDate)}</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs capitalize 
              ${note.type === 'diary' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}
            >
              {note.type}
            </div>
          </div>

          {/* Hover Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </motion.div>
      ))}

      {/* Edit Note Dialog */}
      <AnimatePresence>
        {showEditingNote && (
          <UpdateNoteDialog showData={showEditingNote} setShowData={setShowEditingNote}
          />
        )}
      </AnimatePresence>
        {showViewDetail && (
          <NoteDetailView showData={showViewDetail} setShowData={setShowViewDetail}
          />
        )}
    </motion.div>
  );
};

// Example EditNoteDialog component (you'll need to implement this)
const EditNoteDialog = ({ note, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700/50 shadow-xl"
      >
        <h3 className="text-xl font-bold text-white mb-4">Edit Note</h3>
        {/* Add your edit form here */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};



const dummyNotes = [
  {
    id: '1',
    title: 'Design Inspiration',
    content: 'Explore minimal UI with dark backgrounds and neon accents.',
    createdAt: '2025-04-20',
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Client wants faster load times and prefers Tailwind.',
    createdAt: '2025-04-18',
  },
  {
    id: '3',
    title: 'Ideas',
    content: 'Build an AI image tagger for uploaded photos.',
    createdAt: '2025-04-17',
  },
];

export function NotesPageComponent() {
  const [selectedNote, setSelectedNote] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          📝 My Notes
        </h1>
        <Link href={'/login'} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg transition">
          <PlusCircle size={18} /> Add Note
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {dummyNotes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedNote(note)}
              className="cursor-pointer bg-gray-800/70 p-5 rounded-2xl shadow-lg border border-gray-700 hover:shadow-purple-500/10 transition-all"
            >
              <h2 className="text-xl font-semibold truncate">{note.title}</h2>
              <p className="text-sm text-gray-400 mt-2 line-clamp-3">{note.content}</p>
              <p className="mt-3 text-xs text-gray-500">{note.createdAt}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal for Viewing Note */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-md text-left"
            >
              <h2 className="text-xl font-bold text-purple-400">{selectedNote.title}</h2>
              <p className="mt-4 text-gray-300 whitespace-pre-wrap">{selectedNote.content}</p>
              <p className="mt-4 text-xs text-gray-500">{selectedNote.createdAt}</p>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// export default Page;