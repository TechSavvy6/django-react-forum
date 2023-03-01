import React from "react";
import {
	Heading,
	Box,
	Text,
	Stack,
	useColorModeValue,
	Flex,
	Divider,
	Avatar,
	Spacer,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useContext } from "react";
import { userContext } from "../stores/User";
import EditQuestionModal from "./EditQuestionModal";
import DeleteQuestionModal from "./DeleteQuestionModal";
import QuestionTag from "./QuestionTag";

const QuestionCard = ({ question, fetchQuestions }) => {
	const CardBackground = useColorModeValue("white", "gray.700");
	const ParagraphColor = useColorModeValue("gray.700", "gray.400");
	const [user] = useContext(userContext);

	return (
		<Box my={2} bg={CardBackground} shadow="md" rounded={"lg"} p={6}>
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
							name={question.user?.username}
						/>
						<Flex direction="column">
							<Text fontWeight="700" ml={4}>
								{question.user.username}
							</Text>
							<Text
								color={useColorModeValue(
									"primary.500",
									"primary.100"
								)}
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
							fetchQuestions={fetchQuestions}
						/>
						<DeleteQuestionModal
							question={question}
							fetchQuestions={fetchQuestions}
							isRedirect={false}
						/>
					</Flex>
				) : (
					<></>
				)}
			</Flex>
			<Link to={`/questions/${question.slug}`}>
				<Heading mt={4} fontSize={"3xl"}>
					{question.title}
				</Heading>
				<Text>{`Posted on ${moment(question.date_created).format(
					"MMMM Do YYYY"
				)}`}</Text>
				<Text mb={4} textColor={ParagraphColor}>
					{question.answers.length} Answers
				</Text>
				<Text>
					{question.content.length <= 200
						? question.content
						: `${question.content.substring(0, 200)}...`}
				</Text>
			</Link>
			<Divider my={4} />
			<Stack
				align={"center"}
				justify={"center"}
				direction={"row"}
				wrap="wrap"
			>
				{question.tags.map((tag, i) => {
					return <QuestionTag topic={tag} key={i} />;
				})}
			</Stack>
		</Box>
	);
};

export default QuestionCard;
