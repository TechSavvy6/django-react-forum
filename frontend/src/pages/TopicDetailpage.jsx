import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { tokenContext } from "../stores/Token";
import { Redirect, useParams } from "react-router-dom";
import axios from "axios";
import { backendHost } from "../config";
import { Heading, Grid, Container, GridItem } from "@chakra-ui/react";

import Footer from "../components/Footer";
import QuestionCard from "../components/QuestionCard";
import Pagination from "../components/Pagination";
import { Helmet } from "react-helmet";
import QuestionCardSkeleton from "../components/QuestionCardSkeleton";

const TopicDetailpage = () => {
	const [token] = useContext(tokenContext);
	const [questions, setQuestions] = useState(null);
	const [isError, setIsError] = useState(false);
	const { name, slug } = useParams();

	const [perPage] = useState(10);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchTopicQuestions = () => {
		if (token)
			axios
				.get(
					backendHost +
						`/api/forum/tags/${slug}/?page=${currentPage}&size=${perPage}`,
					{
						headers: {
							Authorization: `Bearer ${token.access}`,
						},
					}
				)
				.then((res) => {
					setQuestions(res.data.results);
					setCount(res.data.count);
					setPageCount(res.data.pages_count);
					setLoading(false);
				})
				.catch((err) => setIsError(true));
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		if (token) {
			fetchTopicQuestions();
		}
	}, [currentPage, perPage]);

	if (isError) return <Redirect to="/404" />;
	return token ? (
		<>
			<Helmet>
				<title>{name} - Technota</title>
			</Helmet>
			<Navbar />
			<Container maxW="container.lg" minWidth="auto">
				<Heading
					my={4}
					textAlign="center"
					fontSize={{
						base: "xl",
						sm: "2xl",
						md: "3xl",
					}}
				>
					Questions on {name}
				</Heading>
				<Grid
					mt={4}
					templateColumns={{
						md: "repeat(2, 2fr)",
						base: "repeat(1, 1fr)",
					}}
					gap={{ md: 4, base: 0 }}
				>
					{loading ? (
						Array.from({ length: perPage }, (_, i) => i + 1).map(
							(i) => (
								<GridItem key={i} colSpan={1}>
									<QuestionCardSkeleton />
								</GridItem>
							)
						)
					) : questions !== null && questions.length > 0 ? (
						questions.map((question, i) => (
							<GridItem key={i} colSpan={1}>
								<QuestionCard question={question} />
							</GridItem>
						))
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
							No Topics Found
						</Heading>
					)}
				</Grid>
				<Pagination
					pageCount={pageCount}
					setCurrentPage={setCurrentPage}
					currentPage={currentPage}
					count={count}
					pageSize={perPage}
				/>
			</Container>
			<Footer />
		</>
	) : (
		<Redirect to="/login" />
	);
};

export default TopicDetailpage;
