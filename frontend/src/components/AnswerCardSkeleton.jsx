import React from "react";
import {
	Box,
	useColorModeValue,
	Flex,
	Spacer,
	SkeletonCircle,
	SkeletonText,
} from "@chakra-ui/react";

const AnswerCardSkeleton = ({ contentLines }) => {
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
			<SkeletonText my={4} noOfLines={contentLines} />
		</Box>
	);
};

export default AnswerCardSkeleton;
