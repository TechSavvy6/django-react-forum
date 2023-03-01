import {
	Container,
	Heading,
	Skeleton,
	Stack,
	Flex,
	SkeletonCircle,
	SkeletonText,
	Box,
	Spacer,
	Divider,
	useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, Redirect } from "react-router-dom";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import UserCard from "../components/UserCard";
import { backendHost } from "../config";
import { tokenContext } from "../stores/Token";

const UserCardSkeleton = () => {
	const CardBackground = useColorModeValue("white", "gray.700");
	return (
		<Box my={2} bg={CardBackground} shadow="md" rounded={"lg"} p={6}>
			<Flex>
				<Flex alignItems="center">
					<SkeletonCircle size="12" />
					<Flex direction="column">
						<SkeletonText width={20} noOfLines={2} ml={4} />
					</Flex>
				</Flex>
				<Spacer />
			</Flex>
			<Skeleton>
				<Heading my={4}>...</Heading>
			</Skeleton>
			<SkeletonText noOfLines={3} />
			<Divider my={4} />

			<Stack
				align={"center"}
				justify={"center"}
				direction={"row"}
				wrap="wrap"
			>
				{Array.from(
					{ length: 5 },
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
				))}
			</Stack>
		</Box>
	);
};

const UsersBySkills = () => {
	const [token] = useContext(tokenContext);
	const [users, setUsers] = useState([]);
	const { skill } = useParams();
	const [perPage] = useState(10);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		window.scrollTo(0, 0);
		axios
			.get(
				backendHost +
					`/api/users/users-by-skills/${skill}/?page=${currentPage}&size=${perPage}`
			)
			.then((res) => {
				setUsers(res.data.results);
				setCount(res.data.count);
				setPageCount(res.data.pages_count);
				setLoading(false);
			})
			.catch((err) => {
				if (err.response.status === 404) setCurrentPage(1);
			});
	}, [skill, setUsers, currentPage, perPage]);

	return token ? (
		<>
			<Helmet>
				<title>{skill} - Technota</title>
			</Helmet>
			<Navbar />
			<Container maxW="container.sm" minWidth="auto">
				<Heading
					my={3}
					textAlign="center"
					fontSize={{
						base: "2xl",
						sm: "3xl",
						md: "4xl",
					}}
				>
					Users who know {skill} ({count})
				</Heading>

				{loading
					? Array.from({ length: perPage }, (_, i) => i + 1).map(
							(i) => <UserCardSkeleton key={i} />
					  )
					: users.map((user, i) => {
							return <UserCard key={i} user={user} />;
					  })}
				<Pagination
					pageCount={pageCount}
					setCurrentPage={setCurrentPage}
					currentPage={currentPage}
					count={count}
					pageSize={perPage}
				/>
			</Container>
		</>
	) : (
		<Redirect to="/" />
	);
};

export default UsersBySkills;
