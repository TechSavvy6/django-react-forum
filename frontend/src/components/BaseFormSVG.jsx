import React from "react";
import NavBar from "../components/Navbar";
import { Container, Image, Box } from "@chakra-ui/react";

import Header from "../components/Header";
import Footer from "../components/Footer";

const BaseFormSVG = ({ children, svg }) => {
	return (
		<>
			<NavBar />
			<Header />
			<Container maxW="container.lg">
				<Box p={4} display={{ lg: "flex" }}>
					<Box flexShrink={1}>
						<Image
							borderRadius="lg"
							width={{ lg: 350, md: 0, sm: 0, base: 0 }}
							src={svg}
							alt="Auth."
						/>
					</Box>
					<Box flexGrow={1} mt={{ base: 4, md: 0 }} ml={{ md: 10 }}>
						{children}
					</Box>
				</Box>
			</Container>
			<Footer />
		</>
	);
};

export default BaseFormSVG;
