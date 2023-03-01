import React, { createContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

export const tokenContext = createContext([]);

export const TokenProvider = ({ children }) => {
	const [token, setToken] = useLocalStorageState(null, "token");

	return (
		<tokenContext.Provider value={[token, setToken]}>
			{children}
		</tokenContext.Provider>
	);
};
