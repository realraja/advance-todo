"use client";
import AddSkillFormDialog, { AddDateCommentDialog } from '@/components/dialog/addSkillDialog';
import { Pencil, Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useGetAllQuery } from '@/redux/api/skill';
import EditSkillDialog from '@/components/dialog/updateSkillDialog';

function SkillsPage() {
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [showAddDate, setShowAddDate] = useState(false);
    const [skills, setSkills] = useState([]);

    const [editingSkill, setEditingSkill] = useState({});
    const [expandedSkill, setExpandedSkill] = useState(null);

    const {data} = useGetAllQuery();

    useEffect(() => {
    if(data){
        const filteredData = data.data.skill.filter((i)=> !i.isDeleted);
        setSkills(filteredData);
    }
    }, [data])


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
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    My Skills
                </h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddSkill(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition"
                >
                    Add New Skill
                </motion.button>
            </div>

            <AddSkillFormDialog 
                show={showAddSkill} 
                setShow={setShowAddSkill} 
            />
            <AddDateCommentDialog show={showAddDate} setShow={setShowAddDate} />

            {editingSkill && (
                <EditSkillDialog 
                    showData={editingSkill} 
                    setShowData={() => setEditingSkill({})} 
                />
            )}

            <div className="space-y-4">
                {skills.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No skills added yet. Click "Add New Skill" to get started!
                    </div>
                ) : (
                    skills.map(skill => (
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
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setEditingSkill(skill)}
                                                className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                                            >
                                                <Pencil className="w-4 h-4" />
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
                    ))
                )}
            </div>
        </div>
    );
}

export default SkillsPage;