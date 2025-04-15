'use client';

import { appLogoImg, siteNavigationArr, userDefaultImg } from '@/constants/websiteData';
import { logout } from '@/redux/slicer/auth';
import { logoutUser } from '@/utils/authRequests';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,Dialog, Transition
} from '@headlessui/react';
import { motion } from "framer-motion";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState,Fragment, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import {
    BellIcon,
    ArrowRightOnRectangleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const [mounted, setMounted] = useState(false);
    // const router = useRouter();

    const { userData, isUser, loading } = useSelector((state) => state.auth);
    // console.log(userData);
    const imgUrl = userData?.imgUrl || userDefaultImg;

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null; // Render nothing until mounted
    return (
        <Disclosure as="nav" className="bg-gray-900 shadow">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            {/* Left logo and menu */}
                            <div className="flex sm:items-stretch sm:justify-start">
                                {/* Logo */}
                                <div className="flex flex-shrink-0 items-center cursor-pointer">
                                    <img
                                        className="h-16 w-auto"
                                        src={appLogoImg}
                                        alt="Your Company"
                                    />
                                </div>

                                {/* Desktop navigation */}
                                {/* <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-800 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div> */}

                                <DesktopNavigation />
                            </div>

                            {/* Right side - actions */}
                            {loading ? (
                                <ClipLoader color="#2F77DE" size={45} speedMultiplier={1.5} />
                            ) : isUser ? <RightSideImageButtonMenu imgUrl={imgUrl} name={userData?.name} email={userData?.email} /> : <LoginLink />}
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {/* <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                    </DisclosurePanel> */}
                </>
            )}
        </Disclosure>
    );
}

const RightSideImageButtonMenu = ({ imgUrl, name = 'example', email = 'example@gmail.com' }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

    return (<>
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* New Job Button */}
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-md font-medium cursor-pointer">
                + New Job
            </button>

            {/* Notification Icon */}
            <button
                type="button"
                className="relative cursor-pointer rounded-full bg-gray-900 p-1 text-gray-400 hover:text-white focus:outline-none"
            >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
                <div>
                    <MenuButton className="flex rounded-full bg-gray-900 cursor-pointer text-sm focus:outline-none">
                        <span className="sr-only">Open user menu</span>
                        <img                        
                            className="h-8 w-8 rounded-full"
                            src={imgUrl}
                            alt=""
                        />
                    </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-20 mt-2 w-64 rounded-xl bg-[#1F1B2E] text-white shadow-lg ring-1 ring-black/10 focus:outline-none p-4 space-y-2">

                    {/* Profile Header */}
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-2">
                        <img
                        onClick={() => router.push('/profile')}
                            className="h-12 w-12 rounded-full border cursor-pointer border-white/20"
                            src={imgUrl}
                            alt="User avatar"
                        />
                        <div onClick={() => copyEmailToClipboard(email)} className="cursor-copy">
                            <p className="font-semibold text-sm">{name}</p>
                            <p className="text-xs text-gray-400">{email}</p>
                        </div>
                    </div>

                    {/* Menu Items */}

                    {
                        siteNavigationArr.map(({href,icon:Icon,name}, index) => (
                            <MenuItem key={index}>
                                {({ active }) => (
                                    <Link
                                        href={href}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${active ? 'bg-white/10' : ''
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {name}
                                    </Link>
                                )}
                            </MenuItem>
                        ))
                    }




                    {/* Sign Out */}
                    <MenuItem>
                        {({ active }) => (
                            <button
                                onClick={()=> setShowLogoutDialog(true)}
                                className={`flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm rounded-md justify-center mt-3 font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20`}
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                Sign out
                            </button>
                        )}
                    </MenuItem>
                </MenuItems>

            </Menu>
        </div>
        <LogoutConfirmButton show={showLogoutDialog} setShow={setShowLogoutDialog} buttonText={'LogOut'} runFunction={handleLogout} />
        </>
    )
}


const LogoutConfirmButton = ({ show, setShow, buttonText, runFunction,description='This action is irreversible and you will permanently Log out' }) => {
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
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
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
                className="w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-2xl border border-gray-800"
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
                  <Dialog.Title className="text-lg font-semibold text-gray-100">
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
                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 border border-gray-700"
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
                    className="rounded-lg cursor-pointer bg-red-600 px-4 py-2 text-sm font-semibold text-white"
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
        <div className="max-sm:hidden flex justify-center items-center gap-3 ml-5">
            {siteNavigationArr.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={`px-5 py-2 rounded-md ${pathname === item.href
                        ? "bg-gray-950  text-purple-300"
                        : "hover:bg-gray-800"
                        }`}
                >
                    <p>{item.name}</p>
                </Link>
            ))}

        </div>
    )
}

const LoginLink = () => (<Link
    href={"/login"}
    className="text-purple-500 flex justify-center items-center gap-2"
>
    Login
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6"
    >
        <path
            fillRule="evenodd"
            d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
        />
    </svg>
</Link>)


