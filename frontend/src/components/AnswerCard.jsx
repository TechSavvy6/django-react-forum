import React, { useContext } from "react";
import {
	Box,
	Text,
	useColorModeValue,
	Flex,
	Avatar,
	Spacer,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import moment from "moment";
import { userContext } from "../stores/User";
import DeleteAnswerModal from "./DeleteAnswerModal";
import EditAnswerModal from "./EditAnswerModal";

const AnswerCard = ({ answer, fetchQuestion }) => {
	const CardBackground = useColorModeValue("white", "gray.700");
	const [user] = useContext(userContext);

	return (
		<Box my={2} bg={CardBackground} shadow="md" rounded={"lg"} p={6}>
			<Flex>
				<Link to={`/profile/${answer.user?.username}`}>
					<Flex alignItems="center">
						<Avatar
							borderWidth={2}
							borderColor="primary.500"
							size={"md"}
							src={answer.user.profile.image}
							alt={"Avatar Alt"}
							loading="lazy"
							name={answer.user?.username}
						/>
						<Flex direction="column">
							<Text fontWeight="700" ml={4}>
								{answer.user.username}
							</Text>
							<Text
								color={useColorModeValue(
									"primary.500",
									"primary.100"
								)}
								fontSize="sm"
								ml={4}
							>
								@{answer.user.username}
							</Text>
						</Flex>
					</Flex>
				</Link>
				<Spacer />
				{user.id === answer.user.id ? (
					<Flex alignItems="center">
						<EditAnswerModal
							answer={answer}
							fetchQuestion={fetchQuestion}
						/>
						<DeleteAnswerModal
							answer={answer}
							fetchQuestion={fetchQuestion}
						/>
					</Flex>
				) : (
					<></>
				)}
			</Flex>
			<Text my={4}>{answer.content}</Text>
			<Text>{`Posted on ${moment(answer.date_created).format(
				"MMMM Do YYYY"
			)}`}</Text>
		</Box>
	);
};

export default AnswerCard;
