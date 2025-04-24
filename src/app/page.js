"use client";
import { TaskPage } from "@/components/workAndTask/taskPage";
import { WorkPage } from "@/components/workAndTask/workPage";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LayoutGrid,
  List,
  CalendarDays,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Shield,
  BarChart2,
  Edit,
  ChevronDown,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useSelector } from "react-redux";
import { appLogoImg } from "@/constants/websiteData";
import { GoalPage } from "@/components/goal/goal";
import FolderManager from "./image/page";
import MoviePage from "./movie/page";
import SkillsPage from "./skill/page";
// import { GoalPage } from "@/components/goal/goal";

const Page = () => {
  const [activeTab, setActiveTab] = useState("work");
  const [mute, setMute] = useState(false);

  const route = useRouter();

  useEffect(() => {
    setMute(true);
  }, []);

  const { isUser } = useSelector((state) => state.auth);
  // if(!mute) return;

  if (!isUser || !mute)
    return (
      <>
        <OldNotLoginPage /> <NotLoginPage />
      </>
    );

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Animated Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Productivity Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your work and tasks efficiently
        </p>
      </motion.header>

      {/* Tab Navigation */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
          {["work", "task"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-12"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "work" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "work" ? -20 : 20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "work" ? <WorkPage /> : <TaskPage />}
          </motion.div>
        </AnimatePresence>
      </motion.main>


<div className="my-8 border border-gray-300 border-dotted"></div>
<GoalTabs />
<GotoButton handleGoto={()=> route.push('/goals')} pageName={'Goals'} />
<div className="my-8 border border-gray-300 border-dotted"></div>
<FolderManager />
<GotoButton handleGoto={()=> route.push('/image')} pageName={'Folders'} />
<div className="my-8 border border-gray-300 border-dotted"></div>
<MoviePage />
<GotoButton handleGoto={()=> route.push('/movie')} pageName={'Movies'} />
<div className="my-8 border border-gray-300 border-dotted"></div>
<SkillsPage />
<GotoButton handleGoto={()=> route.push('/skill')} pageName={'Skills'} />
      {/* Animated Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-gray-500 text-sm"
      >
        <p>
          © {new Date().getFullYear()} Productivity App. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default Page;

const GotoButton = ({handleGoto,pageName}) => <motion.button
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: 20 }}
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={handleGoto}
className="flex items-center m-auto cursor-pointer gap-2 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 hover:text-white border border-purple-500/30 transition-all"
>
<ExternalLink className="size-5" />
Go To {pageName} Page
</motion.button>

const GoalTabs = ({}) => {
  const [activeTab, setActiveTab] = useState("weekly");
  
  // Animation variants for cleaner code
  const tabContentVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 50 : -50,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 50 : -50,
      transition: { duration: 0.2, ease: "easeIn" }
    })
  };

  // Determine animation direction based on tab order
  const tabs = ["weekly", "monthly", "yearly"];
  const getDirection = (newTab) => {
    const newIndex = tabs.indexOf(newTab);
    const oldIndex = tabs.indexOf(activeTab);
    return newIndex > oldIndex ? 1 : -1;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Tab Navigation */}
      
      <motion.div
                className="flex justify-center my-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative flex space-x-1  rounded-xl p-1 border">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab
                                    ? "text-white"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Calendar className="size-4" />
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

      {/* Smooth Content Transition */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-12"
      >
        <AnimatePresence mode="wait" custom={getDirection(activeTab)}>
          <motion.div
            key={activeTab}
            custom={getDirection(activeTab)}
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <GoalPage type={activeTab} />
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

function OldNotLoginPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("grid"); // 'grid', 'list', or 'calendar'

  // Sample tasks data
  const sampleTasks = [
    {
      id: 1,
      title: "Complete project proposal",
      dueDate: "Today",
      completed: false,
    },
    {
      id: 2,
      title: "Review team tasks",
      dueDate: "Tomorrow",
      completed: false,
    },
    {
      id: 3,
      title: "Schedule weekly meeting",
      dueDate: "Today",
      completed: true,
    },
  ];
  const features = [
    {
      icon: <CheckCircle className="text-purple-400" size={24} />,
      title: "Task Management",
      description: "Easily create, organize, and track your tasks",
    },
    {
      icon: <Clock className="text-blue-400" size={24} />,
      title: "Time Tracking",
      description: "Monitor how you spend your time on different activities",
    },
    {
      icon: <TrendingUp className="text-green-400" size={24} />,
      title: "Progress Analytics",
      description: "Visualize your productivity with beautiful charts",
    },
    {
      icon: <Users className="text-pink-400" size={24} />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team members",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Boost Your Productivity
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              The all-in-one platform to organize your work, manage tasks, and
              collaborate with your team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/register")}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 flex items-center gap-2"
              >
                Get Started <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/login")}
                className="px-8 py-3 bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700 rounded-xl font-medium flex items-center gap-2"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Amazing Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Designed to help you stay organized and productive
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* View Modes Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Flexible View Modes
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Visualize your work the way you prefer
            </p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
              <button
                onClick={() => setActiveView("grid")}
                className={`p-2 rounded-lg flex items-center gap-1 ${
                  activeView === "grid"
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <LayoutGrid size={18} />
                <span className="text-xs">Grid</span>
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`p-2 rounded-lg flex items-center gap-1 ${
                  activeView === "list"
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List size={18} />
                <span className="text-xs">List</span>
              </button>
              <button
                onClick={() => setActiveView("calendar")}
                className={`p-2 rounded-lg flex items-center gap-1 ${
                  activeView === "calendar"
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <CalendarDays size={18} />
                <span className="text-xs">Calendar</span>
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden p-6"
          >
            {/* Grid View */}
            {activeView === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/70 border border-gray-700/50 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div
                          className={`size-10 rounded-full flex items-center justify-center ${
                            task.completed
                              ? "bg-green-500/20"
                              : "bg-gradient-to-br from-purple-600 to-blue-500"
                          }`}
                        >
                          <CheckCircle
                            className={`size-5 ${
                              task.completed ? "text-green-400" : "text-white"
                            }`}
                          />
                        </div>
                        <span className="ml-3 px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                          {task.dueDate}
                        </span>
                      </div>
                      <div className="w-5 h-5 rounded bg-gray-700"></div>
                    </div>
                    <h3 className="font-medium text-white mb-3">
                      {task.title}
                    </h3>
                    <div className="flex justify-end">
                      <div className="text-gray-300 hover:text-white cursor-pointer">
                        <Edit size={18} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* List View */}
            {activeView === "list" && (
              <div className="space-y-4">
                {sampleTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between bg-gray-800/70 border border-gray-700/50 rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center mr-3 ${
                          task.completed
                            ? "bg-green-500/20"
                            : "bg-gradient-to-br from-purple-600 to-blue-500"
                        }`}
                      >
                        <CheckCircle
                          className={`size-4 ${
                            task.completed ? "text-green-400" : "text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{task.title}</h3>
                        <p className="text-xs text-gray-400">{task.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-gray-300 hover:text-white cursor-pointer">
                        <Edit size={16} />
                      </div>
                      <div className="w-4 h-4 rounded bg-gray-700"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Calendar View */}
            {activeView === "calendar" && (
              <div className="min-h-[300px]">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-gray-400 text-sm py-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, index) => {
                    const day = index + 1;
                    const hasTask = sampleTasks.some(
                      (task) =>
                        (task.dueDate === "Today" && day === 15) ||
                        (task.dueDate === "Tomorrow" && day === 16)
                    );

                    return (
                      <div
                        key={index}
                        className={`aspect-square p-1 border border-gray-700/30 rounded ${
                          day === 15
                            ? "bg-purple-500/10 border-purple-500/30"
                            : ""
                        }`}
                      >
                        <div className="h-full flex flex-col">
                          <span
                            className={`text-xs ${
                              day > 30 ? "text-gray-600" : "text-gray-300"
                            }`}
                          >
                            {day <= 30 ? day : ""}
                          </span>
                          {hasTask && (
                            <div className="mt-1 flex-1 flex items-center justify-center">
                              <div className="size-2 rounded-full bg-purple-400"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Join thousands of productive people who are already using our
              platform
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/register")}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 flex items-center gap-2 mx-auto"
            >
              Create Free Account <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function NotLoginPage() {
  const router = useRouter();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState(null);

  // Feature Data
  const features = [
    {
      icon: <CheckCircle className="text-purple-400" size={24} />,
      title: "Intelligent Task Management",
      description:
        "Create tasks with natural language processing and smart suggestions",
      details: [
        "AI-powered task creation",
        "Recurring task templates",
        "Priority auto-tagging",
        "Sub-tasks with progress tracking",
      ],
    },
    {
      icon: <Clock className="text-blue-400" size={24} />,
      title: "Time Analytics",
      description: "Automatic time tracking with detailed insights",
      details: [
        "Activity timeline visualization",
        "Focus time detection",
        "Productivity trends",
        "Customizable reports",
      ],
    },
    {
      icon: <TrendingUp className="text-green-400" size={24} />,
      title: "Performance Dashboard",
      description: "Real-time analytics of your productivity metrics",
      details: [
        "Completion rate tracking",
        "Time allocation pie charts",
        "Weekly performance scores",
        "Comparative analytics",
      ],
    },
    {
      icon: <Users className="text-pink-400" size={24} />,
      title: "Team Collaboration",
      description: "Seamless teamwork with shared workspaces",
      details: [
        "Real-time task assignments",
        "Comment threads per task",
        "File attachments with preview",
        "Role-based permissions",
      ],
    },
    {
      icon: <BarChart2 className="text-yellow-400" size={24} />,
      title: "Advanced Reporting",
      description: "Customizable reports for deep insights",
      details: [
        "Exportable PDF/CSV reports",
        "Custom report builder",
        "Scheduled report delivery",
        "Data visualization tools",
      ],
    },
    {
      icon: <Shield className="text-indigo-400" size={24} />,
      title: "Enterprise Security",
      description: "Military-grade protection for your data",
      details: [
        "End-to-end encryption",
        "SOC 2 Type II compliant",
        "Two-factor authentication",
        "IP restriction controls",
      ],
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content:
        "This platform transformed how our team works. We've seen a 40% increase in project completion rates since implementation.",
      avatar:
        "https://res.cloudinary.com/dwc3gwskl/image/upload/v1745058876/0/muhelzgqzgf2entuwn7d.jpg",
    },
    {
      name: "Michael Chen",
      role: "CTO at StartupX",
      content:
        "The analytics dashboard alone is worth the price. Being able to visualize our team's productivity patterns has been game-changing.",
      avatar:
        "https://res.cloudinary.com/dwc3gwskl/image/upload/v1745084918/0/cbdua0r3roe31h9n1wnp.jpg",
    },
    {
      name: "Emma Rodriguez",
      role: "Freelance Designer",
      content:
        "As a solo professional, the task automation features save me at least 5 hours per week. The mobile app is incredibly intuitive.",
      avatar:
        "https://res.cloudinary.com/dwc3gwskl/image/upload/v1745084979/0/qrq9jfyfvphox5vx8wpk.png",
    },
  ];

  // FAQs
  const faqs = [
    {
      question: "How secure is my data?",
      answer:
        "We use 256-bit encryption for all data in transit and at rest. Our infrastructure is regularly audited and complies with GDPR, CCPA, and SOC 2 standards.",
    },
    {
      question: "Can I use this with my team?",
      answer:
        "Absolutely! We offer team plans from 2 to 200+ users with collaborative features like shared projects, task assignments, and team analytics.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Yes, we have fully-featured iOS and Android apps that sync instantly with your desktop experience. All core functionality is available on mobile.",
    },
    {
      question: "What integrations are available?",
      answer:
        "We integrate with Slack, Google Calendar, Microsoft Teams, Zoom, GitHub, Jira, and 50+ other tools through our API and Zapier connection.",
    },
    {
      question: "How does the free trial work?",
      answer:
        "Get full access to all premium features for 14 days. No credit card required. After the trial, you can choose any paid plan or continue with our free forever tier.",
    },
  ];

  // Pricing Tiers
  const pricing = [
    {
      name: "Starter",
      price: "Free",
      description: "For individuals getting started",
      features: [
        "Up to 5 projects",
        "Basic task management",
        "1 month activity history",
        "Email support",
      ],
      cta: "Get Started",
    },
    {
      name: "Pro",
      price: "$9",
      period: "/user/month",
      description: "For power users and small teams",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "1 year activity history",
        "Priority support",
        "Team collaboration (up to 10)",
      ],
      popular: true,
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited everything",
        "Dedicated account manager",
        "On-premise deployment",
        "Custom integrations",
        "Advanced security controls",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navigation */}

      {/* Hero Section */}

      {/* Trusted By Section */}

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to organize, track, and optimize your workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all group"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gray-800/70 group-hover:bg-gradient-to-br from-purple-600/20 to-blue-600/20 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <span className="text-purple-400 mr-2">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who transformed their
              productivity
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8"
                    >
                      <div className="flex items-center mb-6">
                        <div className="size-12 rounded-full bg-gray-700 overflow-hidden mr-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 italic">
                        "{testimonial.content}"
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeTestimonial === index
                      ? "bg-purple-500"
                      : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-gray-800/50 border rounded-xl p-6 ${
                  tier.popular ? "border-purple-500" : "border-gray-700/50"
                } relative`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold text-white">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-gray-400 ml-1">{tier.period}</span>
                  )}
                </div>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <span className="text-purple-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 rounded-lg font-medium ${
                    tier.popular
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-gray-700/50 text-gray-300 hover:text-white border border-gray-600"
                  }`}
                >
                  {tier.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about LifeTrack
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-800 pb-4"
              >
                <button
                  onClick={() =>
                    setActiveFAQ(activeFAQ === index ? null : index)
                  }
                  className="flex justify-between items-center w-full text-left"
                >
                  <h3 className="text-lg font-medium text-white">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`text-gray-400 transition-transform ${
                      activeFAQ === index ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>
                <AnimatePresence>
                  {activeFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-400 mt-2">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your productivity?
            </h2>
            <p className="text-gray-300 mb-8">
              Join over 50,000 professionals and teams who use LifeTrack to get
              more done every day.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/register")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 flex items-center gap-2 mx-auto"
            >
              Start Your Free 14-Day Trial <ArrowRight size={18} />
            </motion.button>
            <p className="text-gray-400 text-sm mt-4">
              No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900/80 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8">
                  <img src={appLogoImg} alt="logos" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  LifeTrack
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                The complete productivity platform for individuals and teams.
              </p>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Facebook", "Instagram"].map(
                  (social, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      {social}
                    </a>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                {[
                  "Features",
                  "Pricing",
                  "Integrations",
                  "Updates",
                  "Roadmap",
                ].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                {[
                  "Blog",
                  "Help Center",
                  "Tutorials",
                  "Webinars",
                  "Community",
                ].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Careers", "Contact", "Press", "Legal"].map(
                  (item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} LifeTrack. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
