import DropdownUser from './DropdownUser';
// import LogoIcon from '../../images/logo/logo-icon.svg';
// import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaSolid from '@fortawesome/free-solid-svg-icons';
import { useProfile } from '@/providers/UserProfileProvider';
import { useEffect } from 'react';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none border-b-2 border-gray-200 relative z-20">
        <div className="flex items-center justify-between lg:justify-end gap-2 px-6 py-4.5 lg:py-4.5">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            {/* <!-- Hamburger Toggle BTN --> */}
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="z-20 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden border-none"
            >
              <span className="relative block h-5.5 w-5.5 cursor-pointer px-2">
                <FontAwesomeIcon icon={FaSolid.faBars} />
              </span>
            </button>
            {/* <!-- Hamburger Toggle BTN --> */}
          </div>
          <div className="flex items-center gap-3 2xsm:gap-7">
            <DropdownUser />
          </div>
        </div>
    </header>
  );
};

export default Header;
