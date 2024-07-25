import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useProfile } from "@/providers/UserProfileProvider";
import { useState } from "react";
import AppLoading from "@/components/AppLoading";
import { useLoading } from "@/providers/LoadingProvider";
// import Header from "@/components/Header";

export default function RootLayout(props: { children?: ReactNode }) {
    const {state} = useProfile();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const {state: loadingState} = useLoading();
    const loadingState = useLoading()['state'];
    return (
        state.profile ? <>
            <AppLoading visibility={loadingState.loading ? "block" : "hidden"} />
            <div className="flex h-screen overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        {/* HEADER */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />  
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {props.children}
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </> :
        <main className="p-4">
            {props.children}
            <Outlet />
        </main>
    );
}