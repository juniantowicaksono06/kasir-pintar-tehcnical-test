export interface State {
    profile: APP.IUserProfile | undefined,
}

export type Action = {
    type: 'setProfile';
    payload: APP.IUserProfile
};

export function handleAuthReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'setProfile':
            return { ...state, profile: {
                ...action.payload as APP.IUserProfile
            } };
        default:
            throw new Error();
    }
}