import React from "react";
import {
	Box,
	chakra,
	Container,
	Heading,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { config } from "../config";

const Header = () => {
	return (
		<Box bg={useColorModeValue("gray.50", "gray.700")} p={15} mb={8}>
			<Container maxWidth="container.md">
				<chakra.p
					mb={2}
					fontSize="xs"
					fontWeight="semibold"
					letterSpacing="wide"
					color="gray.400"
					textTransform="uppercase"
				>
					For Developers
				</chakra.p>
				<Heading
					fontSize={{
						base: "lg",
						sm: "xl",
						md: "3xl",
						lg: "4xl",
					}}
					mb={2}
				>
					{config.slogan.substring(0, 24).toUpperCase()}
				</Heading>
				<Text fontSize="lg">
					{config.slogan.substring(24).toLowerCase()}
				</Text>
			</Container>
		</Box>
	);
};

export default Header;
