import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';
import { useProfile } from '@/providers/UserProfileProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaSolid from '@fortawesome/free-solid-svg-icons';
import { useLoading } from '@/providers/LoadingProvider';

const DropdownUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const loadingDispatch = useLoading()['dispatch'];
    const {state} = useProfile();

    const trigger = useRef<any>(null);
    const dropdown = useRef<any>(null);

    const loadImage = async () => {
        const response = await fetch(`${state.profile?.picture}`);
        if(response.ok) {
            setProfilePicture(`/images/${state.profile?.picture}`);
            setImageLoaded(true);
        }
    }

    useEffect(() => {
        loadImage();
        const clickHandler = ({ target }: MouseEvent) => {
        if (!dropdown.current) return;
        if (
            !dropdownOpen ||
            dropdown.current.contains(target) ||
            trigger.current.contains(target)
        )
            return;
        setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, []);

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
        if (!dropdownOpen || keyCode !== 27) return;
        setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        
        return () => document.removeEventListener('keydown', keyHandler);
    });
    

    return (
        <>
            <div className="relative mt-2 mb-2">
            <Link
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-4"
                to="#"
            >
                <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black">
                    {state.profile?.name}
                </span>
                </span>

                <span className="h-12 w-12 rounded-full">
                {
                    !imageLoaded ? <SkeletonTheme>
                    <Skeleton
                        height={48}
                        width={48}
                        circle
                    />
                    </SkeletonTheme> : profilePicture == "" ? <></> : <img src={`${profilePicture}`} alt="User Profile Picture" className="rounded-full" />
                }
                </span>

                <svg
                className="hidden fill-current sm:block"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
                    fill=""
                />
                </svg>
            </Link>

            {/* <!-- Dropdown Start --> */}
            <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute right-0 mt-4 flex w-72 lg:w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
                dropdownOpen === true ? 'block' : 'hidden'
                }`}
            >
                <div className="px-8">
                {
                    !imageLoaded ? <SkeletonTheme>
                    <Skeleton
                        height={185}
                        width={185}
                        circle
                    />
                    </SkeletonTheme> : profilePicture == "" ? <></> : <div className='flex justify-center mt-3'>
                    <img src={`${profilePicture}`} alt="User Profile Picture" className="rounded-full" />
                    </div>
                }
                </div>
                <div className='mt-5 mb-2'>
                    <h3 className="text-center">
                        {/* {props.profile?.fullname} */}
                        {state.profile?.name}
                    </h3>
                    <p className='text-center mt-2'>
                        {state.profile?.role}
                    </p>
                </div>
                <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base" onClick={async() => {
                    loadingDispatch({type: 'startLoading'});
                    const response = await fetch(`${window.location.origin}/api/v1/logout`, {
                        method: "GET",
                    });

                    if(response.ok) {
                        const result = await response.json() as {
                            code: number
                        };
                        if(result.code == 200) {
                            window.location.href = '/login';
                        }
                    }
                    else {
                        loadingDispatch({type: 'stopLoading'});
                        Swal.fire({
                            title: "Error",
                            text: "Telah terjadi kesalahan",
                            icon: "error",
                            confirmButtonText: "Ok"
                        })
                        return false;
                    }
                }}>
                    <span>
                        <FontAwesomeIcon icon={FaSolid.faRightFromBracket} />
                    </span>
                    Log Out
                </button>
            </div>
            {/* <!-- Dropdown End --> */}
            </div>
        </>
    );
};

export default DropdownUser;
