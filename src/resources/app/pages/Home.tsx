import { useEffect } from "react";
import { useProfile } from "../providers/UserProfileProvider";

export default function Home() {
    const { state } = useProfile();
    useEffect(() => {
        document.title = "Home"
    })
    return (
        <div className="w-100 h-screen">
            <div className="flex justify-center items-center">
                <div className="border-gray-200 border-2 mt-9 py-3 px-6 rounded-md">
                    <h2 className="text-2xl font-bold">Selamat Datang, {state.profile?.name}</h2>
                </div>
            </div>
        </div>
    );
}