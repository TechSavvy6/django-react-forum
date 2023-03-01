import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { backendHost } from "../config";
import {
	Heading,
	Box,
	Text,
	Stack,
	useColorModeValue,
	Container,
	Flex,
	Button,
	Divider,
	Avatar,
	useToast,
	Spacer,
} from "@chakra-ui/react";
import { Link, Redirect } from "react-router-dom";
import { useContext } from "react";
import { tokenContext } from "../stores/Token";
import Navbar from "../components/Navbar";
import moment from "moment";
import AnswerCard from "../components/AnswerCard";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyFormTextareaInput from "../components/TextFields/MyFormTextAreaInput";
import { userContext } from "../stores/User";
import EditQuestionModal from "../components/EditQuestionModal";
import DeleteQuestionModal from "../components/DeleteQuestionModal";
import QuestionTag from "../components/QuestionTag";
import { Helmet } from "react-helmet";
import QuestionCardSkeleton from "../components/QuestionCardSkeleton";
import AnswerCardSkeleton from "../components/AnswerCardSkeleton";

const QuestionDetail = () => {
	const [token] = useContext(tokenContext);
	const [user] = useContext(userContext);
	const CardBackground = useColorModeValue("white", "gray.700");
	const { slug } = useParams();
	const [question, setQuestion] = useState(null);
	const [isError, setIsError] = useState(false);
	const userNameTextColor = useColorModeValue("primary.500", "primary.100");
	const [loading, setLoading] = useState(true);

	const toast = useToast();
	const fetchQuestion = () => {
		axios
			.get(backendHost + `/api/forum/questions/${slug}/`, {
				headers: {
					Authorization: `Bearer ${token.access}`,
				},
			})
			.then((res) => {
				setQuestion(res.data);
				setLoading(false);
			})
			.catch((err) => setIsError(true));
	};
	useEffect(() => {
		if (token) fetchQuestion();
	}, [slug, token]);
	if (isError) return <Redirect to="/404" />;
	return token ? (
		<>
			<Navbar />
			{loading ? (
				<Container maxW="container.lg" minWidth="auto">
					<QuestionCardSkeleton contentLines={10} />
					{Array.from({ length: 3 }, (_, i) => i + 1).map((i) => (
						<AnswerCardSkeleton contentLines={3} key={i} />
					))}
				</Container>
			) : question ? (
				<Container maxW="container.lg" minWidth="auto">
					<Helmet>
						<title>{question.title} - Technota</title>
					</Helmet>
					<Box
						bg={CardBackground}
						shadow={"md"}
						rounded={"lg"}
						my={2}
						p={6}
					>
						<Flex>
							<Link to={`/profile/${question.user?.username}`}>
								<Flex alignItems="center">
									<Avatar
										borderWidth={2}
										borderColor="primary.500"
										size={"md"}
										src={question.user.profile.image}
										alt={"Avatar Alt"}
										loading="lazy"
										name={question.user.username}
									/>
									<Flex direction="column">
										<Text fontWeight="700" ml={4}>
											{question.user.username}
										</Text>
										<Text
											color={userNameTextColor}
											fontSize="sm"
											ml={4}
										>
											@{question.user.username}
										</Text>
									</Flex>
								</Flex>
							</Link>
							<Spacer />
							{user && user.id === question.user.id ? (
								<Flex alignItems="center">
									<EditQuestionModal
										question={question}
										fetchQuestions={fetchQuestion}
									/>
									<DeleteQuestionModal
										question={question}
										isRedirect={true}
										fetchQuestions={fetchQuestion}
									/>
								</Flex>
							) : (
								<></>
							)}
						</Flex>
						<Heading mt={4} fontSize={"3xl"}>
							{question.title}
						</Heading>
						<Text mb={4}>{`Posted on ${moment(
							question.date_created
						).format("MMMM Do YYYY")}`}</Text>
						<Text>{question.content}</Text>
						<Divider my={4} />
						<Stack
							align={"center"}
							justify={"center"}
							direction={"row"}
							wrap="wrap"
						>
							{question.tags.map((tag, i) => {
								return <QuestionTag key={i} topic={tag} />;
							})}
						</Stack>
					</Box>
					<Heading my={6} fontSize="3xl">
						Answers ({question.answers.length})
					</Heading>
					<Box
						bg={CardBackground}
						shadow={"md"}
						rounded={"lg"}
						my={2}
						p={4}
					>
						<Formik
							initialValues={{
								answer: "",
							}}
							validationSchema={Yup.object({
								answer: Yup.string()
									.max(
										300,
										"Must be Atleast 300 Characters or less"
									)
									.required("This Field is Required"),
							})}
							onSubmit={(
								{ answer },
								{ setSubmitting, resetForm, setFieldError }
							) => {
								axios
									.post(
										backendHost +
											`/api/forum/questions/${question.slug}/answer/`,
										{
											content: answer,
										}
									)
									.then((res) => {
										resetForm();
										setSubmitting(false);
										fetchQuestion();
										toast({
											title: "Your Answer Posted Sucessfully",
											status: "success",
											duration: 20000,
											isClosable: true,
										});
									})
									.catch((err) => {
										setSubmitting(false);
										setFieldError(
											"answer",
											"Error Occured"
										);
									});
							}}
						>
							{(props) => (
								<Form>
									<MyFormTextareaInput
										label="Answer"
										name="answer"
										placeholder="Give You Answer Here"
										maxLength={100}
									/>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
									>
										Post Your Answer
									</Button>
								</Form>
							)}
						</Formik>
					</Box>
					{question.answers.map((answer, i) => (
						<AnswerCard
							answer={answer}
							fetchQuestion={fetchQuestion}
							key={i}
						/>
					))}
				</Container>
			) : (
				<></>
			)}
		</>
	) : (
		<Redirect to="/login" />
	);
};

export default QuestionDetail;
