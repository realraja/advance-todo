"use client";
import AddMovieDialog, { AddWatchDateDialog, EditMovieDialog } from '@/components/dialog/addMovieDialog';
import { useGetAllQuery } from '@/redux/api/movie';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Calendar, Film, Tv, Check, Clock, Play, Star, StarHalf } from 'lucide-react';
// import AddWatchDateDialog from '@/components/dialog/addWatchDateDialog';
// import EditMovieDialog from '@/components/dialog/editMovieDialog';
import classNames from 'classnames';

function Page() {
    const [showAddMovie, setShowAddMovie] = useState(false);
    const [showAddWatchDate, setShowAddWatchDate] = useState(false);
    const [showEditMovie, setShowEditMovie] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieData, setMovieData] = useState([]);

    const { data, refetch } = useGetAllQuery();

    useEffect(() => {
        if (data) {
            const filterDelete = data.data.movie.filter((i)=> !i.isDeleted)
            setMovieData(filterDelete);
        }
    }, [data]);

    const handleAddWatchDate = (movie) => {
        setSelectedMovie(movie);
        setShowAddWatchDate(true);
    };

    const handleEditMovie = (movie) => {
        setSelectedMovie(movie);
        setShowEditMovie(true);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                        My Movie Collection
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddMovie(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus size={18} />
                        Add Movie
                    </motion.button>
                </motion.div>

                {/* Movies Grid */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {movieData.map((movie) => (
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
                                        src={movie.imgUrl}
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
                                                {renderRatingStars(movie.rating/2)}
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
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleEditMovie(movie)}
                                            className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-700/50 text-gray-300 hover:bg-gray-700/70 px-3 py-2 rounded"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {movieData.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <Film className="text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-medium text-gray-400 mb-2">
                            No movies found
                        </h3>
                        <p className="text-gray-500 mb-4 max-w-md">
                            You haven't added any movies yet. Click the button below to add your first movie!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddMovie(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                        >
                            <Plus size={18} />
                            Add Your First Movie
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Dialogs */}
            <AddMovieDialog 
                show={showAddMovie} 
                setShow={setShowAddMovie} 
                onSuccess={refetch}
            />
            
            {selectedMovie && (
                <>
                    <AddWatchDateDialog
                        show={showAddWatchDate}
                        setShow={setShowAddWatchDate}
                        movie={selectedMovie}
                        onSuccess={refetch}
                    />
                    <EditMovieDialog
                        show={showEditMovie}
                        setShow={setShowEditMovie}
                        movie={selectedMovie}
                        onSuccess={refetch}
                    />
                </>
            )}
        </div>
    );
}

export default Page;