import React from "react";
import {
	Heading,
	Avatar,
	Box,
	Text,
	Stack,
	useColorModeValue,
	chakra,
	Flex,
	Icon,
	Center,
	Divider,
	SkeletonCircle,
	Skeleton,
	SkeletonText,
} from "@chakra-ui/react";
import moment from "moment";
import { MdHistory } from "react-icons/md";
import SkillTag from "./SkillTag";

const ProfileCardSkeleton = () => {
	const CardBackground = useColorModeValue("white", "gray.700");

	return (
		<>
			<Box
				backgroundColor={CardBackground}
				shadow={"md"}
				rounded={"lg"}
				p={4}
			>
				<Center>
					<SkeletonCircle size={130} />
				</Center>
				<Skeleton mt={4}>
					<chakra.h1>..........</chakra.h1>
				</Skeleton>
				<Box mt={4} textAlign="center">
					<SkeletonText noOfLines={5} />
					<Skeleton mt={4}>
						<chakra.h1>..........</chakra.h1>
					</Skeleton>
				</Box>
			</Box>

			<Box
				bg={CardBackground}
				shadow="md"
				rounded={"lg"}
				my={2}
				py={4}
				px={6}
			>
				<Skeleton>
					<chakra.h1>..........</chakra.h1>
				</Skeleton>
				<Divider my={2} />
				<Stack align={"center"} direction={"row"} wrap="wrap">
					{Array.from(
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
					))}
				</Stack>
			</Box>
		</>
	);
};

const ProfileCard = ({ user, isLoading }) => {
	const CardBackground = useColorModeValue("white", "gray.700");
	const ParagraphColor = useColorModeValue("gray.700", "gray.400");
	const dateJoinedTextColor = useColorModeValue("gray.700", "gray.200");

	return isLoading ? (
		<ProfileCardSkeleton />
	) : (
		<>
			<Box bg={CardBackground} shadow={"md"} rounded={"lg"} my={2}>
				<Center>
					<Avatar
						borderWidth={2}
						borderColor="primary.500"
						size={"2xl"}
						src={user.profile.image}
						alt={"Avatar Alt"}
						mt={2}
						loading="lazy"
						name={user.username}
					/>
				</Center>
				<chakra.h1
					my={3}
					textAlign="center"
					fontWeight="bold"
					fontSize="lg"
				>
					@ {user.username}
				</chakra.h1>
				<Box textAlign="center" pb={4}>
					{user.profile.bio === null ||
					user.profile.bio === "" ? null : (
						<Text py={4} color={ParagraphColor}>
							{user.profile.bio}
						</Text>
					)}

					<Flex
						alignItems="center"
						justifyContent="center"
						color={dateJoinedTextColor}
					>
						<Icon as={MdHistory} h={6} w={6} mr={2} />

						<chakra.h1 px={2} fontSize="sm">
							{`Joined for ${moment(
								user.date_joined,
								"YYYYMMDD"
							).fromNow()}`}
						</chakra.h1>
					</Flex>
				</Box>
			</Box>
			{user.profile.skills === null || user.profile.skills.length < 1 ? (
				<></>
			) : (
				<Box
					bg={CardBackground}
					shadow="md"
					rounded={"lg"}
					my={2}
					py={4}
					px={6}
				>
					<Heading fontSize={"2xl"}>Skills</Heading>
					<Divider my={2} />
					<Stack align={"center"} direction={"row"} wrap="wrap">
						{user.profile.skills?.map((skill, i) => {
							return <SkillTag key={i} skill={skill} />;
						})}
					</Stack>
				</Box>
			)}
		</>
	);
};

export default ProfileCard;
