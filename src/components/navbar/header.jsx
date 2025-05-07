'use client';

import { appLogoImg, siteNavigationArr, userDefaultImg } from '@/constants/websiteData';
import { logout } from '@/redux/slicer/auth';
import { logoutUser } from '@/utils/authRequests';
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems, Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, Fragment, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { BellIcon, ArrowRightOnRectangleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import AddTaskWorkFormDialog from '../dialog/addTaskWorkDialog';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const { userData, isUser, loading } = useSelector((state) => state.auth);
    const imgUrl = userData?.imgUrl || userDefaultImg;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <StartLoader />;

    return (
        <Disclosure as="nav" className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700/50">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            {/* Left logo and menu */}
                            <div className="flex sm:items-stretch sm:justify-start">
                                {/* Logo */}
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-shrink-0 items-center cursor-pointer"
                                >
                                  <Link href='/'>
                                  
                                    <img
                                        className="h-16 w-auto"
                                        src={appLogoImg}
                                        alt="Your Company"
                                    />
                                  </Link>
                                </motion.div>

                                <DesktopNavigation />
                            </div>

                            {/* Right side - actions */}
                            {loading ? (
                                <ClipLoader color="#8B5CF6" size={45} speedMultiplier={1.5} />
                            ) : isUser ? (
                                <RightSideImageButtonMenu 
                                    imgUrl={imgUrl} 
                                    name={userData?.name} 
                                    email={userData?.email} 
                                />
                            ) : (
                                <LoginLink />
                            )}
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    );
}

const RightSideImageButtonMenu = ({ imgUrl, name = 'example', email = 'example@gmail.com' }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showAddWorkDialog, setShowAddWorkDialog] = useState(false);

    const handleLogout = async () => {
        const data = await logoutUser({});
        if (data.success) {
            await dispatch(logout());
            toast.success(data.message);
            router.push('/login')
        } else {
            toast.error(data.message);
        }
    }

    const copyEmailToClipboard = (email) => {
        navigator.clipboard.writeText(email).then(() => {
            toast.success("Email copied to clipboard!");
        }).catch((err) => {
            toast.error("Failed to copy email: " + err.message);
        });
    };

    return (
        <>
            <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* New Job Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddWorkDialog(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm px-4 py-2 rounded-lg font-medium cursor-pointer shadow-md shadow-purple-500/20 transition-all"
                >
                    + New Work
                </motion.button>

                {/* Notification Icon */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="relative cursor-pointer rounded-full bg-gray-800/50 p-1 text-gray-400 hover:text-white focus:outline-none border border-gray-700/50"
                >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </motion.button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                    <div>
                        <MenuButton className="flex rounded-full bg-gray-800/50 cursor-pointer text-sm focus:outline-none border border-gray-700/50">
                            <span className="sr-only">Open user menu</span>
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                className="h-8 w-8 rounded-full"
                                src={imgUrl}
                                alt=""
                            />
                        </MenuButton>
                    </div>
                    <MenuItems 
                        as={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 z-20 mt-2 w-64 rounded-xl bg-gray-800/90 backdrop-blur-lg text-white shadow-xl ring-1 ring-gray-700/50 focus:outline-none p-4 space-y-2 border border-gray-700/50"
                    >
                        {/* Profile Header */}
                        <motion.div 
                            className="flex items-center gap-3 border-b border-white/10 pb-4 mb-2"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                onClick={() => router.push('/profile')}
                                className="h-12 w-12 rounded-full border cursor-pointer border-purple-500/30"
                                src={imgUrl}
                                alt="User avatar"
                            />
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                onClick={() => copyEmailToClipboard(email)} 
                                className="cursor-copy"
                                initial={{ x: -5, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <p className="font-semibold text-sm text-white">{name}</p>
                                <p className="text-xs text-gray-400 truncate">{email}</p>
                            </motion.div>
                        </motion.div>

                        {/* Menu Items */}
                        {siteNavigationArr.map(({ href, icon: Icon, name }, index) => (
                            <MenuItem key={index}>
                                {({ active }) => (
                                    <Link
                                        href={href}
                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
                                            active ? 'bg-gray-700/50 text-purple-300' : 'text-gray-300 hover:bg-gray-700/30'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {name}
                                    </Link>
                                )}
                            </MenuItem>
                        ))}

                        {/* Sign Out */}
                        <MenuItem>
                            {({ active }) => (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setShowLogoutDialog(true)}
                                    className={`flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm rounded-lg justify-center mt-3 font-semibold ${
                                        active ? 'bg-red-500/20' : 'bg-red-500/10 hover:bg-red-500/20'
                                    } text-red-400 transition-all`}
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    Sign out
                                </motion.button>
                            )}
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
            
            <LogoutConfirmButton 
                show={showLogoutDialog} 
                setShow={setShowLogoutDialog} 
                buttonText={'LogOut'} 
                runFunction={handleLogout} 
            />
            <AddTaskWorkFormDialog 
                show={showAddWorkDialog} 
                setShow={setShowAddWorkDialog} 
                title={'Add Work'} 
                showTitle={true} 
                showImage={true} 
                showDate={false} 
                showDay={true} 
            />
        </>
    );
};

const LogoutConfirmButton = ({ show, setShow, buttonText, runFunction, description = 'This action is irreversible and you will permanently Log out' }) => {
    const cancelRef = useRef(null);

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                initialFocus={cancelRef}
                onClose={() => setShow(false)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <motion.div
                        className="fixed inset-0 bg-gradient-to-br from-black/90 to-purple-900/20 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-90"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-90"
                    >
                        <Dialog.Panel as={motion.div}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-xl shadow-purple-500/10 border border-gray-700/50"
                        >
                            <motion.div
                                className="flex items-center space-x-4"
                                initial={{ x: -10 }}
                                animate={{ x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <motion.div
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-red-900/30"
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                                </motion.div>
                                <Dialog.Title className="text-lg font-semibold text-white">
                                    Are you sure?
                                </Dialog.Title>
                            </motion.div>

                            <motion.p
                                className="mt-3 text-sm text-gray-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {description}
                            </motion.p>

                            <div className="mt-6 flex justify-end space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="rounded-lg bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700/50 border border-gray-700 transition"
                                    onClick={() => setShow(false)}
                                    ref={cancelRef}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: "#ef4444" // red-500
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="rounded-lg cursor-pointer bg-gradient-to-r from-red-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/20"
                                    onClick={() => {
                                        setShow(false);
                                        runFunction();
                                    }}
                                >
                                    {buttonText}
                                </motion.button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

const DesktopNavigation = () => {
    const pathname = usePathname();

    return (
        <div className="max-sm:hidden flex justify-center items-center gap-1 ml-5">
            {siteNavigationArr.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        pathname === item.href
                            ? "bg-gray-800/50 text-purple-300 shadow-inner"
                            : "text-gray-300 hover:bg-gray-800/30 hover:text-white"
                    }`}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </motion.div>
                </Link>
            ))}
        </div>
    );
};

const LoginLink = () => (
    <motion.div whileHover={{ scale: 1.05 }}>
        <Link
            href={"/login"}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md shadow-purple-500/20 transition-all hover:from-purple-500 hover:to-indigo-500"
        >
            Login
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
            >
                <path
                    fillRule="evenodd"
                    d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                />
            </svg>
        </Link>
    </motion.div>
);

const StartLoader = () => (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700/50 flex justify-between items-center px-6 h-16">
        <div className="bg-gray-800/50 animate-pulse rounded-lg h-10 w-32"></div>
        <div className="bg-gray-800/50 animate-pulse size-10 rounded-full"></div>
    </div>
);
