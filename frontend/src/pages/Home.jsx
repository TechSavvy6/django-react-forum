import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { tokenContext } from "../stores/Token";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { backendHost } from "../config";
import {
	Heading,
	Box,
	Grid,
	useColorModeValue,
	Container,
	GridItem,
	Button,
	useToast,
	MenuButton,
	MenuList,
	MenuItem,
	Menu,
	Flex,
} from "@chakra-ui/react";

import Footer from "../components/Footer";
import QuestionCard from "../components/QuestionCard";
import Pagination from "../components/Pagination";
import PopularTopicsCard from "../components/PopularTopicsCard";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyFormTextareaInput from "../components/TextFields/MyFormTextAreaInput";
import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import { FaSearch } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";
import QuestionCardSkeleton from "../components/QuestionCardSkeleton";

const Home = () => {
	const [questions, setQuestions] = useState(null);
	const [token] = useContext(tokenContext);
	const [perPage] = useState(10);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [count, setCount] = useState(0);
	const ordering = {
		latest: "-date_modified",
		oldest: "date_modified",
		title: "title",
	};
	const [questionOrder, setQuestionOrder] = useState(ordering.latest);
	const [loading, setLoading] = useState(true);
	const CardBackground = useColorModeValue("white", "gray.700");
	const toast = useToast();
	const fetchQuestions = (search) => {
		window.scrollTo(0, 0);
		let url = search
			? backendHost +
			  `/api/forum/questions/?page=${currentPage}&size=${perPage}&ordering=${questionOrder}&search=${search}`
			: backendHost +
			  `/api/forum/questions/?page=${currentPage}&size=${perPage}&ordering=${questionOrder}`;
		if (token)
			axios
				.get(url, {
					headers: {
						Authorization: `Bearer ${token.access}`,
					},
				})
				.then((res) => {
					setQuestions(res.data.results);
					setCount(res.data.count);
					setPageCount(res.data.pages_count);
					setLoading(false);
				})
				.catch((err) => setQuestions(null));
	};
	useEffect(() => {
		fetchQuestions();
	}, [currentPage, perPage, token, questionOrder]);

	return token ? (
		<>
			<Navbar />
			<Container maxW="container.lg" minWidth="auto">
				<>
					<Grid
						mt={4}
						templateColumns={{
							md: "repeat(3, 2fr)",
							base: "repeat(1, 1fr)",
						}}
						gap={{ md: 4, base: 0 }}
					>
						<GridItem colSpan={{ md: 2, base: 1 }}>
							<Formik
								initialValues={{
									search: "",
								}}
								validationSchema={Yup.object({
									search: Yup.string().max(
										250,
										"Must be Atleast 250 Characters or less"
									),
								})}
								onSubmit={(
									{ search },
									{ setSubmitting, resetForm, setFieldError }
								) => {
									if (token) fetchQuestions(search);
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
											maxLength={250}
											rightElement={
												<Button
													isLoading={
														props.isSubmitting
													}
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
							<Flex justifyContent="flex-end">
								<Menu>
									<MenuButton
										as={Button}
										colorScheme="gray"
										rightIcon={<ChevronDownIcon />}
									>
										Order By
									</MenuButton>
									<MenuList>
										<MenuItem
											onClick={() => {
												setQuestionOrder(
													ordering.latest
												);
												setLoading(true);
											}}
										>
											By Latest
										</MenuItem>
										<MenuItem
											onClick={() => {
												setQuestionOrder(
													ordering.oldest
												);
												setLoading(true);
											}}
										>
											By Oldest
										</MenuItem>
										<MenuItem
											onClick={() => {
												setQuestionOrder(
													ordering.title
												);
												setLoading(true);
											}}
										>
											By Title
										</MenuItem>
									</MenuList>
								</Menu>
							</Flex>
							{loading ? (
								Array.from(
									{ length: perPage },
									(_, i) => i + 1
								).map((i) => (
									<QuestionCardSkeleton
										contentLines={5}
										key={i}
									/>
								))
							) : questions !== null && questions.length > 0 ? (
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
									No Questions Found
								</Heading>
							)}
							{}
							<Box
								bg={CardBackground}
								shadow={"md"}
								rounded={"lg"}
								my={2}
								p={6}
							>
								<Heading my={4} fontSize={"3xl"}>
									Post a Question
								</Heading>
								<Formik
									initialValues={{
										title: "",
										content: "",
										tags: "",
									}}
									validationSchema={Yup.object({
										title: Yup.string()
											.min(
												10,
												"Must be atleast 10 characters"
											)
											.max(
												250,
												"Must be Atleast 250 Characters or less"
											)
											.required("This Field is Required"),
										content: Yup.string()
											.max(
												1000,
												"Must be Atleast 1000 Characters or less"
											)
											.required("This Field is Required"),
										tags: Yup.string()
											.max(
												150,
												"Must be Atleast 150 Characters or less"
											)
											.required("This Field is Required"),
									})}
									onSubmit={(
										{ title, content, tags },
										{
											setSubmitting,
											resetForm,
											setFieldError,
										}
									) => {
										let tagsArray = tags
											.split(",")
											.map((str) => ({
												name: str,
											}));
										axios
											.post(
												backendHost +
													`/api/forum/questions/`,
												{
													title,
													content,
													tags: tagsArray,
												}
											)
											.then((res) => {
												resetForm();
												setSubmitting(false);
												fetchQuestions();
												toast({
													title: "Your Question Posted Sucessfully",
													status: "success",
													duration: 20000,
													isClosable: true,
												});
											})
											.catch(({ response }) => {
												setSubmitting(false);
												if (response) {
													let errors = response.data;
													let errorKeys =
														Object.keys(errors);
													errorKeys.map((val) => {
														if (
															Array.isArray(
																errors[val]
															)
														) {
															setFieldError(
																val,
																errors[val][0]
															);
															return null;
														} else {
															setFieldError(
																val,
																errors[val]
															);
															return null;
														}
													});
												}
											});
									}}
								>
									{(props) => (
										<Form>
											<MyFormTextInput
												label="Title"
												name="title"
												placeholder="Title"
												maxLength={250}
											/>
											<MyFormTextareaInput
												label="Content"
												name="content"
												placeholder="Content"
												maxLength={1000}
											/>
											<MyFormTextareaInput
												label="Tags"
												name="tags"
												placeholder="Tags"
												maxLength={150}
												helpText="Seprate each tag with comma"
											/>
											<Button
												isLoading={props.isSubmitting}
												type="submit"
												mt={2}
											>
												Post Question
											</Button>
										</Form>
									)}
								</Formik>
							</Box>
						</GridItem>
						<GridItem colSpan={1}>
							<PopularTopicsCard />
						</GridItem>
					</Grid>
				</>
			</Container>
			<Footer />
		</>
	) : (
		<Redirect to="/login" />
	);
};

export default Home;
