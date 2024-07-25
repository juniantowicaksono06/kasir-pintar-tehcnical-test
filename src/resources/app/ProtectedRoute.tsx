import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import { useProfile } from "./providers/UserProfileProvider";
import { State } from "./context/reducer";
import { useLoading } from "./providers/LoadingProvider";


export default function ProtectedRoute({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [isVerified, setIsVerified] = useState(false);
    const [isRequestFinish, setIsRequestFinish] = useState(false);
    const { dispatch } = useProfile();
    const loadingDispatch = useLoading()['dispatch'];

    async function verify() {
        const response = await fetch(`${window.location.origin as string}/api/v1/verify`, {
            method: "GET"
        })
        if(response.ok) {
            const result: API.IAPIResponse = await response.json();
            if(result.code == 200) {
                setIsVerified(true);
                const {user} = result.data;
                dispatch({
                    type: "setProfile",
                    payload: user as APP.IUserProfile
                });
                loadingDispatch({
                    type: 'stopLoading'
                });
            }
            else {
                setIsVerified(false);
            }
        }
        setIsRequestFinish(true);
    }
    useEffect(() => {
        verify();
    }, []);
    return isVerified && isRequestFinish ? children : isRequestFinish ? <Navigate to="/login" /> : <></>;
}