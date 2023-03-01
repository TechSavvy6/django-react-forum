import { Image } from "@chakra-ui/image";
import { Box, Flex } from "@chakra-ui/layout";
import { Button, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import SVG404 from "../assets/svgs/404.svg";

const Error404 = () => {
	return (
		<Flex
			mt={12}
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
		>
			<Box flexShrink={1}>
				<Image
					borderRadius="lg"
					width={{ lg: 450, md: 400, sm: 350, base: 250 }}
					src={SVG404}
					alt="Auth."
				/>
			</Box>
			<Heading
				fontSize={{
					base: "lg",
					sm: "2xl",
					md: "4xl",
				}}
				mt={4}
			>
				Page Not Found!
			</Heading>
			<Link mt={4} href="/" _hover={{ textDecoration: "none" }}>
				<Button>
					<FaArrowLeft style={{ marginRight: 5 }} /> Go Back To Home
				</Button>
			</Link>
		</Flex>
	);
};

export default Error404;
