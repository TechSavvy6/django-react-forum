import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

import {
	Heading,
	Box,
	Stack,
	useColorModeValue,
	Flex,
	Icon,
	Divider,
	IconButton,
	Spacer,
	Tooltip,
	Skeleton,
} from "@chakra-ui/react";
import { backendHost } from "../config";
import { useContext } from "react";
import { tokenContext } from "../stores/Token";
import { Link } from "react-router-dom";
import { FaCompass } from "react-icons/fa";
import QuestionTag from "./QuestionTag";

const PopularTopicsSkeleton = () => {
	return Array.from(
		{ length: 10 },
		(_, i) => Math.floor(Math.random() * (80 - 40 + 1)) + 40
	).map((tag, i) => (
		<Skeleton
			key={i}
			style={{
				marginBottom: 3,
				marginLeft: 3,
			}}
			height="20px"
			width={`${tag}px`}
		/>
	));
};

const PopularTopicsCard = () => {
	const [token] = useContext(tokenContext);
	const [topics, setTopics] = useState(null);
	const CardBackground = useColorModeValue("white", "gray.700");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(backendHost + "/api/forum/tags/?page=1&size=10", {
				headers: {
					Authorization: `Bearer ${token.access}`,
				},
			})
			.then((res) => {
				setTopics(res.data.results);
				setLoading(false);
			});
	}, [token]);
	return (
		<Box
			bg={CardBackground}
			shadow="md"
			rounded={"lg"}
			my={2}
			py={4}
			px={6}
		>
			<Flex alignItems="center">
				<Heading fontSize={"2xl"}>Popular Topics</Heading>
				<Spacer />
				<Link to="/explore">
					<Tooltip label="Explore" fontSize="md">
						<IconButton
							aria-label="explore"
							variant="ghost"
							icon={<Icon as={FaCompass} />}
						/>
					</Tooltip>
				</Link>
			</Flex>
			<Divider my={2} />
			<Stack align={"center"} direction={"row"} wrap="wrap">
				{loading ? (
					<PopularTopicsSkeleton />
				) : topics !== null && topics.length > 0 ? (
					topics?.map((topic, i) => (
						<QuestionTag key={i} topic={topic} />
					))
				) : (
					<Heading
						my={3}
						textAlign="center"
						fontSize={{
							base: "lg",
						}}
					>
						No Topics Found
					</Heading>
				)}
			</Stack>
		</Box>
	);
};

export default PopularTopicsCard;
