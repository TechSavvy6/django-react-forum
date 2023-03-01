import React from "react";
import {
	Heading,
	Box,
	Stack,
	useColorModeValue,
	Flex,
	Divider,
	Spacer,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
} from "@chakra-ui/react";

const QuestionCardSkeleton = ({ contentLines }) => {
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
			<SkeletonText noOfLines={contentLines} />
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

export default QuestionCardSkeleton;
