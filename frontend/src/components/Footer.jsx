import React from "react";
import {
	Box,
	chakra,
	Container,
	Stack,
	Text,
	useColorModeValue,
	VisuallyHidden,
} from "@chakra-ui/react";
import { FaInstagram, FaFacebook, FaGithub } from "react-icons/fa";
import { config, socialLinks } from "../config";

const SocialButton = ({ children, label, href }) => {
	return (
		<chakra.button
			bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
			rounded={"full"}
			w={8}
			h={8}
			cursor={"pointer"}
			as={"a"}
			href={href}
			display={"inline-flex"}
			alignItems={"center"}
			justifyContent={"center"}
			transition={"background 0.3s ease"}
			_hover={{
				bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
			}}
		>
			<VisuallyHidden>{label}</VisuallyHidden>
			{children}
		</chakra.button>
	);
};

export default function Footer() {
	return (
		<Box bg={useColorModeValue("gray.50", "gray.700")} mt={4}>
			<Container
				as={Stack}
				maxW={"6xl"}
				py={4}
				direction={{ base: "column", md: "row" }}
				spacing={4}
				justify={{ base: "center", md: "space-between" }}
				align={{ base: "center", md: "center" }}
			>
				<img src={config.logo} width={30} alt="" />
				<Text>
					© {new Date().getFullYear()} {config.title}. All rights
					reserved
				</Text>
				<Stack direction={"row"} spacing={6}>
					<SocialButton
						label={"Facebook"}
						href={socialLinks.facebook}
					>
						<FaFacebook />
					</SocialButton>
					<SocialButton
						label={"Instagram"}
						href={socialLinks.instagram}
					>
						<FaInstagram />
					</SocialButton>
					<SocialButton label={"Github"} href={socialLinks.github}>
						<FaGithub />
					</SocialButton>
				</Stack>
			</Container>
		</Box>
	);
}
