import React from "react";
import {
	Avatar,
	Box,
	Text,
	Stack,
	useColorModeValue,
	Flex,
	Divider,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SkillTag from "./SkillTag";
const UserCard = ({ user }) => {
	const CardBackground = useColorModeValue("white", "gray.700");
	const ParagraphColor = useColorModeValue("gray.700", "gray.400");
	return (
		<Box bg={CardBackground} shadow={"md"} rounded={"lg"} my={2} p={6}>
			<Link to={`/profile/${user?.username}`}>
				<Flex alignItems="center">
					<Avatar
						borderWidth={2}
						borderColor="primary.500"
						size={"md"}
						src={user.profile.image}
						alt={"Avatar Alt"}
						loading="lazy"
						name={user.username}
					/>
					<Flex direction="column">
						<Text fontWeight="700" ml={4}>
							{user.username}
						</Text>
						<Text
							color={useColorModeValue(
								"primary.500",
								"primary.100"
							)}
							fontSize="sm"
							ml={4}
						>
							@{user.username}
						</Text>
					</Flex>
				</Flex>
			</Link>
			{user.profile.bio === null || user.profile.bio === "" ? null : (
				<Text mt={4} color={ParagraphColor}>
					{user.profile.bio}
				</Text>
			)}
			<Divider my={4} />
			<Stack align={"center"} direction={"row"} wrap="wrap">
				{user.profile.skills?.map((skill, i) => {
					return <SkillTag key={i} skill={skill} />;
				})}
			</Stack>
		</Box>
	);
};

export default UserCard;
