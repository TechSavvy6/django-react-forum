import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendHost } from "../config";
import { useParams, Redirect } from "react-router";
import Navbar from "../components/Navbar";
import { Heading, Grid, Container, GridItem } from "@chakra-ui/react";
import ProfileCard from "../components/ProfileCard";
import Footer from "../components/Footer";
import QuestionCard from "../components/QuestionCard";
import Pagination from "../components/Pagination";
import { useContext } from "react";
import { tokenContext } from "../stores/Token";
import { Helmet } from "react-helmet";
import QuestionCardSkeleton from "../components/QuestionCardSkeleton";

const Profile = () => {
	const [token] = useContext(tokenContext);
	const [user, setUser] = useState(null);
	const [questions, setQuestions] = useState(null);
	const [isError, setIsError] = useState(false);
	const { username } = useParams();

	const [perPage] = useState(10);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [count, setCount] = useState(0);
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [loadingQuestions, setLoadingQuestions] = useState(true);

	const fetchQuestions = () => {
		axios
			.get(
				backendHost +
					`/api/users/questions/${username}/?page=${currentPage}&size=${perPage}`
			)
			.then((res) => {
				setQuestions(res.data.results);
				setCount(res.data.count);
				setPageCount(res.data.pages_count);
				setLoadingQuestions(false);
			})
			.catch((err) => {
				setQuestions(null);
				setLoadingQuestions(false);
			});
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		axios
			.get(backendHost + `/api/users/user-profile/${username}/`)
			.then((res) => {
				setUser(res.data);
				setLoadingProfile(false);
			})
			.catch((err) => setIsError(true));
		fetchQuestions();
	}, [username, currentPage, perPage]);
	if (isError) return <Redirect to="/404" />;
	return token ? (
		<>
			<Helmet>
				<title>
					{user ? `${user.username} - Technota` : "Technota"}
				</title>
			</Helmet>
			<Navbar />
			<Container maxW="container.lg" minWidth="auto">
				<Grid
					mt={4}
					templateColumns={{
						md: "repeat(3, 2fr)",
						base: "repeat(1, 1fr)",
					}}
					gap={{ md: 4, base: 0 }}
				>
					<GridItem colSpan={{ md: 2, base: 1 }}>
						{loadingQuestions ? (
							Array.from(
								{ length: perPage },
								(_, i) => i + 1
							).map((i) => (
								<QuestionCardSkeleton
									contentLines={5}
									key={i}
								/>
							))
						) : questions !== null ? (
							<>
								{questions.map((question, i) => (
									<QuestionCard
										key={i}
										question={question}
										fetchQuestions={fetchQuestions}
									/>
								))}
								<Pagination
									pageCount={pageCount}
									setCurrentPage={setCurrentPage}
									currentPage={currentPage}
									count={count}
									pageSize={perPage}
								/>
							</>
						) : (
							<Heading
								my={3}
								textAlign="center"
								fontSize={{
									base: "xl",
									sm: "2xl",
									md: "3xl",
								}}
							>
								{username} has no questions
							</Heading>
						)}
					</GridItem>
					<GridItem colSpan={1}>
						<ProfileCard user={user} isLoading={loadingProfile} />
					</GridItem>
				</Grid>
			</Container>
			<Footer />
		</>
	) : (
		<Redirect to="/login" />
	);
};

export default Profile;
