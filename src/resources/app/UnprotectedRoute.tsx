import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';


export default function UnprotectedRoute({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [isVerified, setIsVerified] = useState(false);
    const [isRequestFinish, setIsRequestFinish] = useState(false);

    async function verify() {
        const response = await fetch(`${window.location.origin as string}/api/v1/verify`, {
            method: "GET"
        })
        if(response.ok) {
            const result: API.IAPIResponse = await response.json();
            if(result.code == 200) {
                setIsVerified(true);
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
    return !isVerified && isRequestFinish ? children : isRequestFinish ? <Navigate to="/" /> : <></>;
}