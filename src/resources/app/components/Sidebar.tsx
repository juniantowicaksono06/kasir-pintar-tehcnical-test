"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaSolid from '@fortawesome/free-solid-svg-icons';
// import { useProfile } from '../MainLayout/LoadingProvider';
import { useProfile } from '@/providers/UserProfileProvider';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const {state} = useProfile();
//   const pathname = usePathname();

    const [currentPath, setCurrentPath] = useState('/');
    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, [])
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    //   const [menu, setMenu] = useState([] as AppType.IAppMenu[]);
    const [windowPathname, setWindowPathname] = useState('');
    const [sidebarLoaded, setSidebarLoaded] = useState(false);

    const [sidebarExpanded, setSidebarExpanded] = useState<boolean|null>(null);

    return (
    <aside
        ref={sidebar}
        className={`absolute left-0 top-0 z-10 flex h-screen w-80 flex-col overflow-y-hidden bg-gray-700 text-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        >
        <div className="flex items-center justify-between gap-2 px-8 py-3.5 lg:py-3.5">
            <div className="flex justify-center px-4 lg:ml-9 ml-3 mt-1">
                <Link to='/'>
                    <h3 className='text-center'>REIMBURSEMENT</h3>
                    {/* <img src={Logo.src} alt="logo" className="w-full" /> */}
                </Link>
            </div>
            

            <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
            >
            <svg
                className="fill-current"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
                />
            </svg>
            </button>
        </div>
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            <nav className="mt-5 py-4 lg:mt-9 lg:px-6">
            <div>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MENU</h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                    <li>
                        <Link to="/" className={currentPath == '/' ? 'group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-white duration-300 ease-in-out bg-blue-500' : 'hover:bg-gray-500 group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4'} onClick={() => {
                            setCurrentPath('/');
                        }}>
                            <span>
                                <FontAwesomeIcon icon={FaSolid.faHome} />
                                <span className="ml-4">Home</span>
                            </span>
                        </Link>
                        <Link to={state.profile?.role == "staff" ? "/create-reimbursement" : "/reimbursement"} className={currentPath == '/create-reimbursement' || currentPath == '/reimbursement' ? 'group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-white duration-300 ease-in-out bg-blue-500' : 'hover:bg-gray-500 group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4'} onClick={() => {
                            setCurrentPath('/reimbursement');
                        }}>
                            <span>
                                <FontAwesomeIcon icon={state.profile?.role == 'staff' ? FaSolid.faClipboard : FaSolid.faClipboardList} />
                                <span className="ml-4">{state.profile?.role == 'staff' ? 'Reimbursement' : "Data Reimbursement"}</span>
                            </span>
                        </Link>
                    </li>
                    {
                        state.profile?.role == "direktur" ?
                        <li><Link to="/users" className={currentPath == '/users' || currentPath.startsWith('/users') ? 'group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-white duration-300 ease-in-out bg-blue-500' : 'hover:bg-gray-500 group relative flex items-center gap-2.5 rounded-sm py-3 px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4'} onClick={() => {
                                setCurrentPath('/users');
                            }}>
                                <span>
                                    <FontAwesomeIcon icon={FaSolid.faUsers} />
                                    <span className="ml-4">Users</span>
                                </span>
                            </Link>
                        </li> : <></>
                    }
                </ul>
            </div>
            </nav>
        </div>
    </aside>
    );
};
