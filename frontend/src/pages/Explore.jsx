import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { tokenContext } from "../stores/Token";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { backendHost } from "../config";
import { Helmet } from "react-helmet";
import {
	Heading,
	Box,
	Grid,
	Badge,
	useColorModeValue,
	Container,
	GridItem,
	Flex,
	Button,
	Divider,
	Spacer,
	Skeleton,
} from "@chakra-ui/react";

import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import { FaSearch } from "react-icons/fa";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const TopicCardSkeleton = () => {
	const CardBackground = useColorModeValue("white", "gray.700");
	return (
		<Box
			my={2}
			py={4}
			px={6}
			bg={CardBackground}
			shadow="md"
			rounded={"lg"}
		>
			<Skeleton>
				<Heading my={4}>...</Heading>
			</Skeleton>

			<Divider my={3} />
			{Array.from({ length: 3 }, (_, i) => i + 1).map((question, i) => (
				<>
					<Skeleton>
						<Heading fontSize={"md"} my={4}>
							...
						</Heading>
					</Skeleton>
					<Divider my={3} />
				</>
			))}
			<Skeleton>
				<Button rightIcon={<ArrowForwardIcon />}>See More</Button>
			</Skeleton>
		</Box>
	);
};

const TopicCard = ({ topic }) => {
	const CardBackground = useColorModeValue("white", "gray.700");
	return (
		<Box my={2} bg={CardBackground} shadow="md" rounded={"lg"} p={6}>
			<Flex>
				<Heading fontSize={"2xl"}>{topic.name}</Heading>
				<Spacer />
				<Badge px={2} py={1} fontSize=".8em">
					{topic.questions.length}
				</Badge>
			</Flex>
			<Divider my={3} />
			{topic.questions && topic.questions.length > 0 ? (
				<>
					{topic.questions.slice(0, 5).map((question, i) => (
						<Link key={i} to={`/questions/${question.slug}`}>
							<Heading fontSize={"md"}>
								{question.title.length <= 32
									? question.title
									: `${question.title.substring(0, 32)}...`}
							</Heading>
							<Divider my={3} />
						</Link>
					))}
					<Link to={`/explore/${topic.name}-${topic.slug}`}>
						<Button rightIcon={<ArrowForwardIcon />}>
							See More
						</Button>
					</Link>
				</>
			) : (
				<Heading fontSize={"md"}>
					No Question Found on this topic
				</Heading>
			)}
		</Box>
	);
};

const Explore = () => {
	const [token] = useContext(tokenContext);
	const [perPage] = useState(12);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [count, setCount] = useState(0);
	const [topics, setTopics] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchTopics = (search) => {
		let url = search
			? backendHost +
			  `/api/forum/tags/?page=${currentPage}&size=${perPage}&search=${search}`
			: backendHost +
			  `/api/forum/tags/?page=${currentPage}&size=${perPage}`;
		if (token)
			axios
				.get(url, {
					headers: {
						Authorization: `Bearer ${token.access}`,
					},
				})
				.then((res) => {
					setTopics(res.data.results);
					setCount(res.data.count);
					setPageCount(res.data.pages_count);
					setLoading(false);
				})
				.catch((err) => setTopics(null));
	};
	useEffect(() => {
		window.scrollTo(0, 0);
		if (token) fetchTopics();
	}, [currentPage]);
	return token ? (
		<>
			<Helmet>
				<title>Explore Topics - Technota</title>
			</Helmet>
			<Navbar />
			<Container maxW="container.lg" minWidth="auto">
				{loading || (topics !== null && topics.length > 0) ? (
					<Heading
						my={4}
						textAlign="center"
						fontSize={{
							base: "xl",
							sm: "2xl",
							md: "3xl",
						}}
					>
						Explore Topics
					</Heading>
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

				<Formik
					initialValues={{
						search: "",
					}}
					validationSchema={Yup.object({
						search: Yup.string().max(
							50,
							"Must be Atleast 50 Characters or less"
						),
					})}
					onSubmit={(
						{ search },
						{ setSubmitting, resetForm, setFieldError }
					) => {
						if (token) fetchTopics(search);
						setSubmitting(false);
					}}
				>
					{(props) => (
						<Form>
							<MyFormTextInput
								label=""
								icon={FaSearch}
								name="search"
								placeholder="Search"
								maxLength={50}
								rightElement={
									<Button
										isLoading={props.isSubmitting}
										type="submit"
										size="sm"
										m={1}
									>
										Search
									</Button>
								}
							/>
						</Form>
					)}
				</Formik>
				<Grid
					mt={4}
					templateColumns={{
						md: "repeat(2, 2fr)",
						lg: "repeat(3, 3fr)",
						base: "repeat(1, 1fr)",
					}}
					gap={{ md: 4, base: 0 }}
				>
					{loading
						? Array.from({ length: perPage }, (_, i) => i + 1).map(
								(i) => (
									<GridItem key={i} colSpan={1}>
										<TopicCardSkeleton key={i} />
									</GridItem>
								)
						  )
						: topics !== null && topics.length > 0
						? topics.map((topic, i) => (
								<GridItem key={i} colSpan={1}>
									<TopicCard topic={topic} key={i} />
								</GridItem>
						  ))
						: null}
					{}
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

export default Explore;
