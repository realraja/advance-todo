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
    MenuItems
} from '@headlessui/react';
import {
    Bars3Icon,
    BellIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';



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
                                <BeatLoader color="#2F77DE" margin={4} speedMultiplier={3} />
                            ) : isUser ? <RightSideImageButtonMenu imgUrl={imgUrl} /> : <LoginLink />}
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

const RightSideImageButtonMenu = ({ imgUrl }) => {
    const dispatch = useDispatch();
    const router = useRouter();

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

    return (
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
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <MenuItem>
                        {({ active }) => (
                            <a
                                href="#"
                                className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                )}
                            >
                                Your Profile
                            </a>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {({ active }) => (
                            <p
                                onClick={handleLogout}
                                className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                )}
                            >
                                Sign out
                            </p>
                        )}
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    )
}


const DesktopNavigation = () => {
    const pathname = usePathname();

    return (
        <div className="max-sm:hidden flex justify-center items-center gap-3 ml-5">
            {siteNavigationArr.map((item,index) => (
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


