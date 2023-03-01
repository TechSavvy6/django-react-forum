import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendHost } from "../config";
import {
	useToast,
	Flex,
	Heading,
	Box,
	Image,
	Container,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import TextLink from "../components/TextLink";

import SuccessSVG from "../assets/svgs/Success.svg";
import ErrorSVG from "../assets/svgs/Error.svg";

const EmailConfirmation = () => {
	const toast = useToast();
	const [error, setError] = useState(null);
	const [isActivated, setIsActivated] = useState(false);
	const { uid, token } = useParams();
	useEffect(() => {
		axios
			.post(backendHost + "/api/authentication/users/activation/", {
				uid,
				token,
			})
			.then((res) => {
				if (res.status === 204) {
					setIsActivated(true);
				}
			})
			.catch(({ response }) => {
				if (response) {
					let errors = response.data;
					let errorKeys = Object.keys(errors);
					errorKeys.forEach((val) => {
						if (Array.isArray(errors[val])) setError(errors[val][0]);
						else setError(errors[val]);
					});
				}
			});
	}, [uid, token, toast]);

	return (
		<>
			<Navbar />
			<Container maxW="container.lg">
				{!isActivated ? (
					<Flex
						mt={4}
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
					>
						<Box flexShrink={1}>
							{error ? (
								<Image
									borderRadius="lg"
									width={{
										lg: 350,
										md: 300,
										sm: 250,
										base: 200,
									}}
									src={ErrorSVG}
									alt="Auth."
								/>
							) : null}
						</Box>
						<Heading
							mt={4}
							fontSize={{
								base: "lg",
								sm: "2xl",
								md: "4xl",
							}}
						>
							{!error ? "Processing..." : <>{error}</>}
						</Heading>
						<TextLink mt={8} to="/login" text="Login" />
					</Flex>
				) : (
					<Flex
						mt={4}
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
					>
						<Box flexShrink={1}>
							<Image
								borderRadius="lg"
								width={{ lg: 350, md: 300, sm: 250, base: 200 }}
								src={SuccessSVG}
								alt="Auth."
							/>
						</Box>
						<Heading
							mt={4}
							fontSize={{
								base: "lg",
								sm: "2xl",
								md: "4xl",
							}}
						>
							Email Verified and Account is Activated
						</Heading>
						<TextLink mt={8} to="/login" text="Login" />
					</Flex>
				)}
			</Container>
		</>
	);
};

export default EmailConfirmation;
