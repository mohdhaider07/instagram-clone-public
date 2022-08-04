import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { Router, useRouter } from "next/router";
const UserContext = createContext();

const UserProvider = ({ children }) => {
	const [state, setState] = useState({
		user: {},
		token: "",
	});

	useEffect(() => {
		setState(JSON.parse(window.localStorage.getItem("auth"))); //   user data and token
	}, []);

	const router = useRouter();

	const token = state && state.token ? state.token : "";
	axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

	axios.interceptors.response.use(
		(response) => {
			// Add configurations here
			return response;
		},
		(err) => {
			let res = err.response;

			if (res.status === 401 && res.config && !res.config._isRetryRequest) {
				setState(null);
				window.localStorage.removeItem("auth");
				Router.push("/login");
			}
		}
	);

	return (
		<UserContext.Provider value={[state, setState]}>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserProvider };
