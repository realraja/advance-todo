'use client'
import { useGetQuery } from '@/redux/api/calendar'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, BookOpen, FileText, Film, Award, Target, Droplet, Activity, Workflow,ChevronLeft, ChevronRight  } from 'lucide-react'
import { FaTooth } from 'react-icons/fa'
import { DiaryComponent, GoalComponent, HabitComponent, MediaComponent, SkillComponent, TaskComponent, WorkComponent } from './Components'
import { BeatLoader } from 'react-spinners'
import EventsComponent from './eventComponent'

function HomePage({ date }) {
  const [pageData, setPageData] = useState({})
  const [selectedCategories, setSelectedCategories] = useState({
    all: true,
    habits: false,
    goals: false,
    tasks: false,
    works: false, // ✅ Add this
    diary: false,
    media: false,
    skills: false
  })
  const scrollRef = useRef(null);

  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
const { data, refetch, isLoading } = useGetQuery(formattedDate)

  useEffect(() => {
    setPageData(data?.data || {})
  }, [data])

  const categories = [
    { id: 'all', label: 'All', icon: Activity },
    { id: 'tasks', label: 'Tasks', icon: BookOpen },
    { id: 'works', label: 'Works', icon: Workflow },
    { id: 'habits', label: 'Habits', icon: Check },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'diary', label: 'Diary', icon: FileText },
    { id: 'media', label: 'Media', icon: Film },
    { id: 'skills', label: 'Skills', icon: Award }
  ]

  const toggleCategory = (id) => {
    if (id === 'all') {
      setSelectedCategories({
        all: true,
        habits: false,
        goals: false,
        tasks: false,
        works: false,
        diary: false,
        media: false,
        skills: false
      })
    } else {
      const newSelected = {
        ...selectedCategories,
        [id]: !selectedCategories[id],
        all: false
      }
      setSelectedCategories(newSelected)
    }
  }





  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">

      <div className="relative group scroll-wrapper">
  {/* Scrollable checkbox container */}
  <div
    className="flex overflow-x-auto gap-2 mb-4 scroll-smooth scrollEditclass1 px-6"
    ref={scrollRef}
  >
    {categories.map(category => (
      <motion.label
        key={category.id}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
          selectedCategories[category.id]
            ? 'bg-purple-600/20 border border-purple-500/50'
            : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/30'
        }`}
      >
        <input
          type="checkbox"
          checked={selectedCategories[category.id]}
          onChange={() => toggleCategory(category.id)}
          className="hidden"
        />
        <div className={`w-5 h-5 rounded-md mr-2 flex items-center justify-center transition ${
          selectedCategories[category.id]
            ? 'bg-purple-500 text-white'
            : 'bg-gray-700 text-transparent border border-gray-600'
        }`}>
          {selectedCategories[category.id] && <Check className="w-3 h-3" />}
        </div>
        <div className="flex items-center">
          <category.icon className="w-4 h-4 mr-1" />
          <span className="text-sm">{category.label}</span>
        </div>
      </motion.label>
    ))}
  </div>

  {/* Left Arrow */}
  <button
    onClick={() => scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })}
    className="scroll-arrow absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700/70 hover:bg-purple-600 text-white p-1 rounded-full z-10"
  >
    <ChevronLeft className="w-4 h-4" />
  </button>

  {/* Right Arrow */}
  <button
    onClick={() => scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })}
    className="scroll-arrow absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700/70 hover:bg-purple-600 text-white p-1 rounded-full z-10"
  >
    <ChevronRight className="w-4 h-4" />
  </button>
</div>

        
        {/* Category Checkboxes */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-4"> */}
        {/* <div className="flex overflow-x-auto scrollEditclass1  gap-2 mb-4">
          {categories.map(category => (
            <motion.label
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                selectedCategories[category.id]
                  ? 'bg-purple-600/20 border border-purple-500/50'
                  : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/30'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedCategories[category.id]}
                onChange={() => toggleCategory(category.id)}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-md mr-2 flex items-center justify-center transition ${
                selectedCategories[category.id]
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-transparent border border-gray-600'
              }`}>
                {selectedCategories[category.id] && <Check className="w-3 h-3" />}
              </div>
              <div className="flex items-center">
                <category.icon className="w-4 h-4 mr-1" />
                <span className="text-sm">{category.label}</span>
              </div>
            </motion.label>
          ))}
        </div> */}
      </div>

      {/* Content */}
      
{isLoading && <BeatLoader />}
      {/* event*/}
      {(selectedCategories.all) && (
        <EventsComponent 
          data={pageData.event}
          reFetch={refetch}
        />
      )}
      {/* Task*/}
      {(selectedCategories.all || selectedCategories.tasks) && (
        <TaskComponent 
          task={pageData.task}
          reFetch={refetch}
        />
      )}
      {/* work*/}
      {(selectedCategories.all || selectedCategories.works) && (
        <WorkComponent 
          work={pageData.work}
          reFetch={refetch}
        />
      )}

      {/* goal*/}
      {(selectedCategories.all || selectedCategories.goals) && (
        <GoalComponent 
          goal={pageData.goal}
          reFetch={refetch}
        />
      )}

      {/* diary*/}
      {(selectedCategories.all || selectedCategories.diary) && (
        <DiaryComponent 
          diary={pageData.diary}
          reFetch={refetch}
        />
      )}

      {/* movie*/}
      {(selectedCategories.all || selectedCategories.media) && (
        <MediaComponent 
          movie={pageData.movie}
          reFetch={refetch}
        />
      )}

      {/* skill*/}
      {(selectedCategories.all || selectedCategories.skills) && (
        <SkillComponent 
          skill={pageData.skill}
          reFetch={refetch}
        />
      )}


      {/* Habits Summary - Only shows when habits are selected or "All" is selected */}
      {(selectedCategories.all || selectedCategories.habits) && (
        <HabitComponent 
          isBathed={pageData.isBathed} 
          isBrushed={pageData.isBrushed} 
          isRunning={pageData.isRunning} 
          isDidThat={pageData.isDidThat} 
          reFetch={refetch}
          date={date}
        />
      )}
    </div>
  )
}

export default HomePage

