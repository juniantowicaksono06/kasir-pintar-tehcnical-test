import { createContext, useReducer, useContext } from "react";
import { handleAuthReducer, State, Action } from "@/context/reducer";

interface ProfileContextType {
    state: State,
    dispatch: React.Dispatch<Action>
}

const initialState: State = {
    profile: undefined
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export default function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(handleAuthReducer, initialState);
    return (
        <ProfileContext.Provider value={{ state, dispatch }}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if(!context) {
        throw new Error("useProfile must be used within a UserProfileProvider");
    }
    return context;
}