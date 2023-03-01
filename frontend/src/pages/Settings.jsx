import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "../components/Navbar";
import { tokenContext } from "../stores/Token";
import {
	Heading,
	Box,
	Grid,
	Text,
	Stack,
	useColorModeValue,
	Container,
	GridItem,
	chakra,
	Center,
	Avatar,
	Flex,
	Spacer,
	Divider,
	HStack,
} from "@chakra-ui/react";
import Footer from "../components/Footer";
import { userContext } from "../stores/User";

import EditBioModal from "../components/SettingModals/EditBioModal";
import EditSkillsModal from "../components/SettingModals/EditSkillsModal";
import UpdateAvatarModal from "../components/SettingModals/UpdateAvatarModal";
import ChangePasswordModal from "../components/SettingModals/ChangePasswordModal";
import DeleteAccountModal from "../components/SettingModals/DeleteAccountModal";
import SkillTag from "../components/SkillTag";
import { Helmet } from "react-helmet";

const Settings = () => {
	const [token] = useContext(tokenContext);
	const [user] = useContext(userContext);
	const CardBackground = useColorModeValue("white", "gray.700");

	return token ? (
		<>
			<Helmet>
				<title>Settings - Technota</title>
			</Helmet>
			<Navbar />
			<Container maxW="container.lg" minWidth="auto">
				{user ? (
					<>
						<Grid
							mt={4}
							templateColumns={{
								md: "repeat(3, 2fr)",
								base: "repeat(1, 1fr)",
							}}
							gap={{ md: 4, base: 0 }}
						>
							<GridItem colSpan={{ md: 2, base: 1 }}>
								<Box
									bg={CardBackground}
									shadow="md"
									rounded={"lg"}
									my={2}
									py={4}
									px={6}
								>
									<HStack>
										<Heading fontSize={"2xl"}>Bio</Heading>
										<EditBioModal />
									</HStack>
									<Divider my={2} />
									<Text>{user.profile.bio}</Text>

									<HStack mt={10}>
										<Heading fontSize={"2xl"}>
											Skills
										</Heading>
										<EditSkillsModal />
									</HStack>
									<Divider my={2} />
									<Stack
										align={"center"}
										direction={"row"}
										wrap="wrap"
									>
										{user.profile.skills?.map(
											(skill, i) => {
												return (
													<SkillTag
														key={i}
														skill={skill}
													/>
												);
											}
										)}
									</Stack>
									<Heading
										fontSize={"2xl"}
										mt={10}
										colorScheme="red"
									>
										Danger Zone
									</Heading>
									<Divider my={2} />
									<Flex
										flexDirection={{
											base: "column",
											md: "row",
										}}
										alignItems={{
											base: "start",
											md: "center",
										}}
										my={2}
									>
										<Box>
											<Heading fontSize="md">
												Change Password
											</Heading>
										</Box>
										<Spacer />
										<ChangePasswordModal />
									</Flex>
									<Flex
										flexDirection={{
											base: "column",
											md: "row",
										}}
										alignItems={{
											base: "start",
											md: "center",
										}}
										my={2}
									>
										<Box>
											<Heading fontSize="md">
												Delete this account
											</Heading>
										</Box>
										<Spacer />
										<DeleteAccountModal />
									</Flex>
								</Box>
							</GridItem>
							<GridItem colSpan={1}>
								<Box
									bg={CardBackground}
									shadow={"md"}
									rounded={"lg"}
									my={2}
								>
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
									<Flex
										alignItems="center"
										justifyContent="center"
										flexDirection="column"
										py={4}
									>
										<chakra.h1
											pb={3}
											textAlign="center"
											fontWeight="bold"
											fontSize="lg"
										>
											@ {user.username}
										</chakra.h1>
										<UpdateAvatarModal />
									</Flex>
								</Box>
							</GridItem>
						</Grid>
					</>
				) : (
					<></>
				)}
			</Container>
			<Footer />
		</>
	) : (
		<Redirect to="/" />
	);
};

export default Settings;
