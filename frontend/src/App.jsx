import React, { Suspense, lazy, useContext, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { tokenContext } from "./stores/Token";
// import EmailConfirmation from "./pages/EmailConfirmation";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import LogoutConfirm from "./pages/LogoutConfirm";
// import Error404 from "./pages/Error404";
// import ForgetPassword from "./pages/ForgetPassword";
// import ForgetPasswordConfirm from "./pages/ForgetPasswordConfirm";
import axios from "axios";
import { backendHost } from "./config";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
// import UsersBySkills from "./pages/UsersBySkills";
// import QuestionDetail from "./pages/QuestionDetail";
import { userContext } from "./stores/User";
import { SetUser } from "./stores/actions/UserActions";
import { Center, Spinner } from "@chakra-ui/react";
// import TopicDetailpage from "./pages/TopicDetailpage";
// import Explore from "./pages/Explore";

const Home = lazy(() => import("./pages/Home"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const Explore = lazy(() => import("./pages/Explore"));
const TopicDetailpage = lazy(() => import("./pages/TopicDetailpage"));
const QuestionDetail = lazy(() => import("./pages/QuestionDetail"));
const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation"));
const UsersBySkills = lazy(() => import("./pages/UsersBySkills"));
const ForgetPasswordConfirm = lazy(() =>
	import("./pages/ForgetPasswordConfirm")
);
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const Error404 = lazy(() => import("./pages/Error404"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const LogoutConfirm = lazy(() => import("./pages/LogoutConfirm"));

const getNewToken = (refresh) => {
	const newToken = axios
		.post(backendHost + "/api/token/refresh/", {
			refresh,
		})
		.then((res) => {
			if (res.status === 200) {
				return res.data.access;
			}
		})
		.catch((_) => {
			return null;
		});
	return newToken;
};

function App() {
	const [token, setToken] = useContext(tokenContext);
	const [, userDispatch] = React.useContext(userContext);

	useEffect(() => {
		if (token) {
			axios
				.post(backendHost + "/api/token/verify/", {
					token: token.access,
				})
				.then((res) => {
					if (res.status === 200) {
						axios.defaults.headers.common[
							"Authorization"
						] = `Bearer ${token.access}`;
					}
				})
				.catch(async (err) => {
					const newToken = await getNewToken(token.refresh);
					if (newToken) {
						setToken({ ...token, access: newToken });
						axios.defaults.headers.common[
							"Authorization"
						] = `Bearer ${token.access}`;
					} else setToken(null);
				});
			axios
				.get(backendHost + "/api/authentication/users/me/", {
					headers: {
						Authorization: `Bearer ${token.access}`,
					},
				})
				.then((res) => {
					userDispatch(SetUser(res.data));
				});
		} else setToken(null);
	}, [token]);
	return (
		<BrowserRouter>
			<Suspense
				fallback={
					<Center height="100vh">
						<Spinner size="xl" color="primary.500" thickness={3} />
					</Center>
				}
			>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Signup} />
					<Route path="/logout" component={LogoutConfirm} />
					<Route path="/forget-password" component={ForgetPassword} />
					<Route path="/profile/:username" component={Profile} />
					<Route
						path="/forget-password-confirm/:uid/:token"
						component={ForgetPasswordConfirm}
					/>
					<Route
						path="/email-confirmation/:uid/:token"
						component={EmailConfirmation}
					/>
					<Route
						path="/explore/:name-:slug"
						component={TopicDetailpage}
					/>
					<Route path="/explore" component={Explore} />

					<Route
						path="/users/skills/:skill"
						component={UsersBySkills}
					/>
					<Route path="/questions/:slug" component={QuestionDetail} />
					<Route path="/settings" component={Settings} />
					<Route path="/404" component={Error404} />
					<Redirect to="/404" />
				</Switch>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
