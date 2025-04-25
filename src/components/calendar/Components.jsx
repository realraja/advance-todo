'use client'
import { Activity, Award, BookOpen, Check, Droplet, Edit, Info, Workflow, Plus, Pencil, ChevronDown, ChevronUp, Film, Tv, Calendar, Clock, Play, Star, StarHalf, Target, NotebookPen } from "lucide-react";
import { FaTooth } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useToggleCompleteTaskMutation } from "@/redux/api/task";
import { formatDateDisplay, getDayColor, getDayDisplay } from "@/utils/dateFormats";
import { useEffect, useState } from "react";
import { useAddBathMutation, useAddBrushMutation, useAddDidThatMutation, useAddRunMutation } from "@/redux/api/user";
import { useAsyncMutation } from "@/hook/mutationHook";
import UpdateTaskWorkFormDialog from "../dialog/updateTaskWork";
import { useToggleCompleteWorkMutation } from "@/redux/api/work";
import { AddDateCommentDialog } from "../dialog/addSkillDialog";
import Image from "next/image";
import { AddWatchDateDialog } from "../dialog/addMovieDialog";
import classNames from "classnames";
import { useCompleteMutation } from "@/redux/api/goal";
import dayjs from "dayjs";
import { useFavoriteMutation } from "@/redux/api/diary";
import NoteDetailView from "../dialog/detailDeleteNoteDialog";



export const SkillComponent = ({ skill, reFetch }) => {
    const [skills, setSkills] = useState([]);
    const [showAddDate, setShowAddDate] = useState(false);
    const [expandedSkill, setExpandedSkill] = useState(null);


    useEffect(() => {
        setSkills(skill || [])
    }, [skill]);

    const handleAddToday = async (skillData) => {
        setShowAddDate(skillData._id);
        console.log(skillData)

    }

    const toggleExpandSkill = (skillId) => {
        setExpandedSkill(expandedSkill === skillId ? null : skillId);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-400" />
                Skill
            </h2>
            <div className=" gap-4">
                {skills.map(skill => (
                    <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50 shadow-md"
                    >
                        <div className="p-4 flex items-start">
                            <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image
                                    src={skill.imgUrl}
                                    alt={skill.name}
                                    fill
                                    className="object-cover"
                                    unoptimized // Remove if using Next.js image optimization
                                />
                            </div>

                            <div className="ml-4 flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-white">{skill.name}</h3>
                                        <div className="flex space-x-3 mt-1 text-sm">
                                            <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded">
                                                Target: {skill.targetLevel}
                                            </span>
                                            <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                                                Current: {skill.currentLevel}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleAddToday(skill)}
                                            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </motion.button>
                                        {/* <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteSkill(skill._id)}
                                                className="p-1.5 rounded-full bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button> */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleExpandSkill(skill._id)}
                                            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                                        >
                                            {expandedSkill === skill._id ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedSkill === skill._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-3 pt-3 border-t border-gray-800 text-sm text-gray-400 space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Created:</span>
                                                    <span>{formatDate(skill.createdAt)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Last Updated:</span>
                                                    <span>{formatDate(skill.updatedAt)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Days Practiced:</span>
                                                    <span>{skill.daysOfDid.length}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AddDateCommentDialog show={showAddDate} setShow={setShowAddDate} onSuccess={reFetch} />
        </div>
    )
}
export const MediaComponent = ({ movie, reFetch }) => {
    const [showAddWatchDate, setShowAddWatchDate] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieData, setMovieData] = useState([]);

    // console.log(movie)

    useEffect(() => {
        setMovieData(movie || [])
    }, [movie]);



    const handleAddWatchDate = (movie) => {
        setSelectedMovie(movie);
        setShowAddWatchDate(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Full':
                return <Check className="text-green-400" size={16} />;
            case 'Half':
                return <Clock className="text-yellow-400" size={16} />;
            case 'Started':
                return <Play className="text-blue-400" size={16} />;
            default:
                return null;
        }
    };

    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" size={16} />);
        }

        // Half star
        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="text-yellow-400 fill-yellow-400" size={16} />);
        }

        // Empty stars
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="text-gray-400" size={16} />);
        }

        return (
            <div className="flex items-center gap-0.5">
                {stars}
                <span className="ml-1 text-xs text-gray-300">{rating.toFixed(1)}</span>
            </div>
        );
    };


    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Film className="w-5 h-5 mr-2 text-purple-400" />
                Movie
            </h2>
            <div className=" gap-4">
                {movieData.filter(Boolean).map((movie) => (
                    <motion.div
                        key={movie._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                        {/* Movie Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={movie?.imgUrl}
                                alt={movie.name}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                                {movie.type === 'movie' ? (
                                    <Film className="text-purple-400" size={16} />
                                ) : (
                                    <Tv className="text-blue-400" size={16} />
                                )}
                                <span className="text-xs text-white bg-black/70 px-2 py-1 rounded">
                                    {movie.type}
                                </span>
                            </div>
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                                {getStatusIcon(movie.watched)}
                                <span className="text-xs text-white bg-black/70 px-2 py-1 rounded">
                                    {movie.watched}
                                </span>
                            </div>
                        </div>

                        {/* Movie Details */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-white truncate">
                                    {movie.name}
                                </h3>
                                {movie.rating !== undefined && (
                                    <div className="flex-shrink-0">
                                        {renderRatingStars(movie.rating / 2)}
                                    </div>
                                )}
                            </div>

                            {/* Watch Dates */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                                    <Calendar size={14} />
                                    Watch History
                                </h4>
                                {movie.watchedDates.length > 0 ? (
                                    <ul className="space-y-1">
                                        {movie.watchedDates.map((date) => (
                                            <li
                                                key={date._id}
                                                className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded"
                                            >
                                                {new Date(date.date).toLocaleDateString()} - {date.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-500 italic">No watch dates recorded</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAddWatchDate(movie)}
                                    className={classNames(
                                        "flex-1 flex items-center justify-center gap-1 text-xs px-3 py-2 rounded",
                                        movie.watchedDates.length > 0
                                            ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30"
                                            : "bg-purple-600/30 text-purple-300 hover:bg-purple-600/40"
                                    )}
                                >
                                    <Calendar size={14} />
                                    Add Date
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            {showAddWatchDate && <AddWatchDateDialog
                show={showAddWatchDate}
                setShow={setShowAddWatchDate}
                movie={selectedMovie}
                onSuccess={reFetch}
            />}
        </div>
    )
}
export const GoalComponent = ({ goal, reFetch }) => {
    const [goalArray, setGoalArray] = useState([]);
    const [expandedGoal, setExpandedGoal] = useState(null);

    useEffect(() => {
        setGoalArray(goal || [])
    }, [goal]);



    const [ToggleComplete] = useAsyncMutation(useCompleteMutation);

    const handleToggleCompletion = async (id) => {
        setGoalArray((prev) => {
            return prev.map((goal) => {
                if (goal._id === id) {
                    return { ...goal, completed: !goal.completed };
                }
                return goal;
            })
        });
        await ToggleComplete('Goal Completing...',id);
        reFetch()
    };

    const toggleExpandGoal = (id) => {
        setExpandedGoal(expandedGoal === id ? null : id);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        if (diffDays === -1) return "Yesterday";
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

        return dayjs(date).format("ddd, MMM D");
    };

    const getDateColor = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "text-red-400";
        if (diffDays < 3) return "text-yellow-400";
        return "text-green-400";
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Goal
            </h2>
            <div className=" gap-4">
                {goalArray.map((goal) => {

                    return (
                        <motion.div
                            key={goal._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className={`overflow-hidden rounded-xl transition-all duration-300 ${goal.completed
                                ? 'bg-green-900/20 border-l-4 border-green-500'
                                : 'bg-gray-800/50 border-l-4 border-purple-500'
                                }`}
                        >
                            <div
                                className="flex items-center space-x-4 px-4 py-3 cursor-pointer"
                                onClick={() => toggleExpandGoal(goal._id)}
                            >
                                <div className="cursor-pointer" onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDetailDialog(goal);
                                }}>
                                    {goal.imgUrl ? (
                                        <img
                                            src={goal.imgUrl}
                                            alt="goal"
                                            className="size-8 object-cover rounded-full border-2 border-purple-500"
                                        />
                                    ) : (
                                        <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                            <Info className="size-5 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs bg-blue-600 rounded-lg flex items-center justify-center text-center gap-1 w-fit px-2"><Target className="size-3" />{goal.type}</p>
                                    <h3 className={`font-medium wrap-anywhere truncate ${goal.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                                        {goal.title}
                                    </h3>
                                </div>

                                <div className={`text-sm font-medium ${getDateColor(goal.doBefore)}`}>
                                    {formatDate(goal.doBefore)}
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="checkbox"
                                        checked={goal.completed}
                                        onChange={() => handleToggleCompletion(goal._id)}
                                        className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                    />
                                </motion.div>
                            </div>

                            <AnimatePresence>
                                {expandedGoal === goal._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="px-4 pb-3"
                                    >
                                        <div className="pt-2 border-t border-gray-700/50">
                                            <p className="text-gray-300 text-sm">{goal.description || "No description provided"}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-gray-500">
                                                    Created: {dayjs(goal.createdAt).format("MMM D, YYYY")}
                                                </span>
                                                <span className={`text-xs ${getDateColor(goal.doBefore)}`}>
                                                    Due: {formatDate(goal.doBefore)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    )
}
export const DiaryComponent = ({ diary, reFetch }) => {
    const [noteData, setNoteData] = useState([]);
    const [showViewDetail, setShowViewDetail] = useState({})
    

    useEffect(() => {
        setNoteData(diary || [])
    }, [diary]);


    const [ToggleFavorite] = useAsyncMutation(useFavoriteMutation);

    const handleFavorite = async (id) => {
        setNoteData((prev) => {
          return prev.map((note) => {
            if (note._id === id) {
              return { ...note, isFavorite: !note.isFavorite };
            }
            return note;
          })
        });
        await ToggleFavorite('Adding To Favorite',id);
      }


        const formatDate = (dateString) => {
          return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        };
      



    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <NotebookPen className="w-5 h-5 mr-2 text-purple-400" />
                Dairy
            </h2>
            <div className=" gap-4">
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
            </div>
            {showViewDetail && (
                      <NoteDetailView showData={showViewDetail} setShowData={setShowViewDetail}
                      />
                    )}
        </div>
    )
}
export const WorkComponent = ({ work, reFetch }) => {
    const [workArray, setWorkArray] = useState([]);
    const [showUpdateDialog, setShowUpdateDialog] = useState({});

    useEffect(() => {
        setWorkArray(work || [])
    }, [work]);


    const [ToggleCompleteWork] = useAsyncMutation(useToggleCompleteWorkMutation);

    const handleToggleCompletion = async (id) => {
        setWorkArray((prev) => {
            return prev.map((work) => {
                if (work._id === id) {
                    return { ...work, completed: !work.completed };
                }
                return work;
            })
        });
        await ToggleCompleteWork('Work Updating...', id);
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Workflow className="w-5 h-5 mr-2 text-purple-400" />
                Daily Work
            </h2>
            <div className=" gap-4">
                {workArray.map((work) => {
                    const dayDisplay = getDayDisplay(work.whenDoWork);
                    const dayColor = getDayColor(work.whenDoWork, dayDisplay.isToday, dayDisplay.isTomorrow);

                    return (
                        <motion.div
                            key={work._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${work.completed
                                ? 'bg-green-900/20 border-l-4 border-green-500'
                                : 'bg-gray-800/50 border-l-4 border-purple-500'
                                }`}
                        >
                            <div className="cursor-pointer" onClick={() => setShowDetailDialog(work)}>
                                {work.imgUrl ? (
                                    <img
                                        src={work.imgUrl}
                                        alt="work"
                                        className="size-8 object-cover rounded-full border-2 border-purple-500"
                                    />
                                ) : (
                                    <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                        <Info className="size-5 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium truncate ${work.completed ? 'line-through text-gray-400' : 'text-white'
                                    }`}>
                                    {work.title}
                                </h3>
                            </div>

                            <div className="max-sm:hidden block">
                                <span className={`px-2 py-1 text-xs rounded-full ${dayColor}`}>
                                    {dayDisplay.text}
                                </span>
                            </div>

                            <div className="block sm:hidden">
                                <span className={`px-2 py-1 text-xs rounded-full ${dayColor}`}>
                                    {dayDisplay.shortText}
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowUpdateDialog(work)}
                                className="text-gray-300 hover:text-white cursor-pointer"
                            >
                                <Edit size={18} />
                            </motion.button>

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <input
                                    type="checkbox"
                                    checked={work.completed}
                                    onChange={() => handleToggleCompletion(work._id)}
                                    className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
            {showUpdateDialog && <UpdateTaskWorkFormDialog onSuccess={reFetch} showData={showUpdateDialog} setShowData={setShowUpdateDialog} />}
        </div>
    )
}
export const TaskComponent = ({ task, reFetch }) => {
    const [taskArray, setTaskArray] = useState([]);
    const [showUpdateDialog, setShowUpdateDialog] = useState({});

    useEffect(() => {
        setTaskArray(task || [])
    }, [task]);


    const [ToggleCompleteTask] = useAsyncMutation(useToggleCompleteTaskMutation);

    const handleToggleCompletion = async (id) => {
        setTaskArray((prev) => {
            return prev.map((task) => {
                if (task._id === id) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            })
        });
        await ToggleCompleteTask('Task Updating...', id);
        reFetch();
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
                Daily Task
            </h2>
            <div className=" gap-4">
                {taskArray.map((task) => {
                    const dateDisplay = formatDateDisplay(task.doTaskOn);

                    return (
                        <motion.div
                            key={task._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${task.completed
                                ? 'bg-green-900/20 border-l-4 border-green-500'
                                : 'bg-gray-800/50 border-l-4 border-purple-500'
                                }`}
                        >
                            <div className="cursor-pointer" onClick={() => setShowDetailDialog(task)}>
                                {task.imgUrl ? (
                                    <img
                                        src={task.imgUrl}
                                        alt="task"
                                        className="size-8 object-cover rounded-full border-2 border-purple-500"
                                    />
                                ) : (
                                    <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                        <Info className="size-5 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-white'
                                    }`}>
                                    {task.title}
                                </h3>
                            </div>

                            <div className="max-sm:hidden">
                                <span className={`px-2 py-1 text-xs rounded-full ${dateDisplay.color}`}>
                                    {dateDisplay.text}
                                </span>
                            </div>

                            <div className="sm:hidden">
                                <span className={`px-2 py-1 text-xs rounded-full ${dateDisplay.color}`}>
                                    {dateDisplay.shortText}
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowUpdateDialog(task)}
                                className="text-gray-300 hover:text-white cursor-pointer"
                            >
                                <Edit size={18} />
                            </motion.button>



                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggleCompletion(task._id)}
                                    className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                />
                            </motion.div>
                        </motion.div>
                    )
                })}
            </div>
            {showUpdateDialog && <UpdateTaskWorkFormDialog onSuccess={reFetch} showData={showUpdateDialog} setShowData={setShowUpdateDialog} />}
        </div>
    )
}
export const HabitComponent = ({ isBrushed, isBathed, isDidThat, isRunning, reFetch, date }) => {
    const [isBrushedData, setIsBrushedData] = useState(false);
    const [isBathedData, setIsBathedData] = useState(false);
    const [isDidThatData, setIsDidThatData] = useState(false);
    const [isRunningData, setIsRunningData] = useState(false);

    useEffect(() => {
        setIsBathedData(isBathed || false);
        setIsBrushedData(isBrushed || false);
        setIsDidThatData(isDidThat || false);
        setIsRunningData(isRunning || false);
    }, [isBathed, isBrushed, isRunning, isDidThat])

    const [AddBrushToday] = useAsyncMutation(useAddBrushMutation);
    const [AddBathToday] = useAsyncMutation(useAddBathMutation);
    const [AddRunningToday] = useAsyncMutation(useAddRunMutation);
    const [AddDidThatToday] = useAsyncMutation(useAddDidThatMutation);

    // console.log(isBathedData || (date.getDate() !== new Date().getDate() && date.getMonth() === new Date().getMonth()))

    const handleAddBrush = async () => {
        if (isBrushedData || (date.getDate() !== new Date().getDate() && date.getMonth() === new Date().getMonth())) return;
        setIsBrushedData(true);
        await AddBrushToday('Adding Brush...');
        reFetch()
    }
    const handleAddBath = async () => {
        if (isBathedData || (date.getDate() !== new Date().getDate() && date.getMonth() === new Date().getMonth())) return;
        setIsBathedData(true);
        await AddBathToday('Adding Bath...')
        reFetch()
    }
    const handleAddRunning = async () => {
        if (isRunningData || (date.getDate() !== new Date().getDate() && date.getMonth() === new Date().getMonth())) return;
        setIsRunningData(true);
        await AddRunningToday('Adding Running...')
        reFetch()
    }
    const handleAddDidThat = async () => {
        if (isDidThatData || (date.getDate() !== new Date().getDate() && date.getMonth() === new Date().getMonth())) return;
        setIsDidThatData(true);
        await AddDidThatToday('Adding Activity...');
        reFetch()
    }


    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Daily Habits
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 cursor-pointer">
                <div onClick={handleAddBrush} className={`p-4 rounded-xl flex items-center ${isBrushedData ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <FaTooth className={`w-6 h-6 mr-3 ${isBrushedData ? 'text-green-400' : 'text-red-400'}`} />
                    <div>
                        <p className="text-sm text-gray-400">Brushed</p>
                        <p className="font-medium text-white">
                            {isBrushedData ? 'Completed' : 'Pending'}
                        </p>
                    </div>
                </div>

                <div onClick={handleAddBath} className={`p-4 rounded-xl flex items-center ${isBathedData ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <Droplet className={`w-6 h-6 mr-3 ${isBathedData ? 'text-green-400' : 'text-red-400'}`} />
                    <div>
                        <p className="text-sm text-gray-400">Bathed</p>
                        <p className="font-medium text-white">
                            {isBathedData ? 'Completed' : 'Pending'}
                        </p>
                    </div>
                </div>

                <div onClick={handleAddRunning} className={`p-4 rounded-xl flex items-center ${isRunningData ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <Activity className={`w-6 h-6 mr-3 ${isRunningData ? 'text-green-400' : 'text-red-400'}`} />
                    <div>
                        <p className="text-sm text-gray-400">Running</p>
                        <p className="font-medium text-white">
                            {isRunningData ? 'Completed' : 'Pending'}
                        </p>
                    </div>
                </div>

                <div onClick={handleAddDidThat} className={`p-4 rounded-xl flex items-center ${isDidThatData ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <Check className={`w-6 h-6 mr-3 ${isDidThatData ? 'text-green-400' : 'text-red-400'}`} />
                    <div>
                        <p className="text-sm text-gray-400">Did That</p>
                        <p className="font-medium text-white">
                            {isDidThatData ? 'Completed' : 'Pending'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}