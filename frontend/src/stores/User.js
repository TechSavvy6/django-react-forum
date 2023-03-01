import React, { createContext, useReducer } from "react";
import UserReducer from "./reducers/UserReducer";

export const userContext = createContext([]);

export const UserProvider = ({ children }) => {
	const [user, userDispatch] = useReducer(UserReducer, null);

	return (
		<userContext.Provider value={[user, userDispatch]}>
			{children}
		</userContext.Provider>
	);
};
