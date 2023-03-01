import { Heading, Flex } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Redirect } from "react-router";
import Navbar from "../components/Navbar";
import { DeleteUserState } from "../stores/actions/UserActions";
import { tokenContext } from "../stores/Token";
import { userContext } from "../stores/User";

const LogoutConfirm = () => {
	const [token, setToken] = useContext(tokenContext);
	const [, userDispatch] = useContext(userContext);

	return token ? (
		<>
			<Navbar />
			<Flex
				justifyContent="center"
				alignItems="center"
				height="60vh"
				flexDirection="column"
			>
				<Heading
					fontSize={{
						base: "xl",
						sm: "3xl",
						md: "4xl",
					}}
				>
					Do You Want To Logout?
				</Heading>
				<Button
					mt={4}
					onClick={() => {
						setToken(null);
						userDispatch(DeleteUserState());
					}}
				>
					Logout
				</Button>
			</Flex>
		</>
	) : (
		<Redirect to="/login" />
	);
};

export default LogoutConfirm;
