import React from "react";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	useDisclosure,
	useColorModeValue,
	Stack,
	useColorMode,
	Container,
	Icon,
	MenuItem,
	Button,
	Menu,
	MenuButton,
	MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
	FaCog,
	FaCompass,
	FaHome,
	FaMoon,
	FaSignInAlt,
	FaSignOutAlt,
	FaSun,
	FaUser,
	FaUserPlus,
} from "react-icons/fa";
import { tokenContext } from "../stores/Token";
import { config } from "../config";
import Headroom from "react-headroom";
import { userContext } from "../stores/User";
import { Link as RouterLink } from "react-router-dom";

const NavLink = ({ children, href, icon }) => (
	<RouterLink to={href}>
		<Button
			colorScheme="gray"
			leftIcon={icon}
			isFullWidth={{ base: true, md: false }}
		>
			{children}
		</Button>
	</RouterLink>
);

const MenuLink = ({ children, href, icon }) => (
	<RouterLink to={href}>
		<MenuItem icon={icon} alignItems="center">
			{children}
		</MenuItem>
	</RouterLink>
);

export default function Navbar() {
	const [token] = React.useContext(tokenContext);
	const [user] = React.useContext(userContext);
	const { colorMode, toggleColorMode } = useColorMode();
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Headroom>
			<Box px={4} bg={useColorModeValue("gray.50", "gray.700")}>
				<Container maxW={"6xl"}>
					<Flex
						h={16}
						alignItems={"center"}
						justifyContent={"space-between"}
					>
						<IconButton
							size={"md"}
							icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
							aria-label={"Open Menu"}
							colorScheme="gray"
							display={{ md: "none" }}
							onClick={isOpen ? onClose : onOpen}
						/>
						<HStack spacing={8} alignItems={"center"}>
							<Box>
								<RouterLink to="/">
									<img src={config.logo} width={30} alt="" />{" "}
								</RouterLink>
							</Box>
							<HStack
								as={"nav"}
								spacing={4}
								display={{ base: "none", md: "flex" }}
							>
								{token ? (
									<>
										<NavLink
											href="/"
											icon={<Icon as={FaHome} />}
										>
											Home
										</NavLink>
										<NavLink
											icon={<Icon as={FaCompass} />}
											href="/explore"
										>
											Explore
										</NavLink>

										<Menu>
											<MenuButton
												as={Button}
												colorScheme="gray"
												rightIcon={<ChevronDownIcon />}
											>
												User
											</MenuButton>
											<MenuList>
												<MenuLink
													href={`/profile/${user?.username}`}
													icon={<Icon as={FaUser} />}
												>
													Profile
												</MenuLink>
												<MenuLink
													icon={
														<Icon
															as={FaSignOutAlt}
														/>
													}
													href="/logout"
												>
													Logout
												</MenuLink>
												<MenuLink
													icon={<Icon as={FaCog} />}
													href="/settings"
												>
													Settings
												</MenuLink>
											</MenuList>
										</Menu>
									</>
								) : (
									<>
										<NavLink
											icon={<Icon as={FaSignInAlt} />}
											href="/login"
										>
											Login
										</NavLink>
										<NavLink
											icon={<Icon as={FaUserPlus} />}
											href="/signup"
										>
											Signup
										</NavLink>
									</>
								)}
							</HStack>
						</HStack>
						<Flex alignItems={"center"}>
							<IconButton
								aria-label="dark-mode-toggle"
								colorScheme="gray"
								onClick={toggleColorMode}
								icon={
									colorMode === "light" ? (
										<FaMoon />
									) : (
										<FaSun />
									)
								}
							/>
						</Flex>
					</Flex>

					{isOpen ? (
						<Box pb={4} display={{ md: "none" }}>
							<Stack as={"nav"} spacing={4}>
								{token ? (
									<>
										<NavLink
											href="/"
											icon={<Icon as={FaHome} />}
										>
											Home
										</NavLink>
										<NavLink
											icon={<Icon as={FaCompass} />}
											href="/explore"
										>
											Explore
										</NavLink>
										<Menu>
											<MenuButton
												colorScheme="gray"
												as={Button}
												rightIcon={<ChevronDownIcon />}
											>
												User
											</MenuButton>
											<MenuList>
												<MenuLink
													href={`/profile/${user?.username}`}
													icon={<Icon as={FaUser} />}
												>
													Profile
												</MenuLink>
												<MenuLink
													icon={
														<Icon
															as={FaSignOutAlt}
														/>
													}
													href="/logout"
												>
													Logout
												</MenuLink>
												<MenuLink
													icon={<Icon as={FaCog} />}
													href="/settings"
												>
													Settings
												</MenuLink>
											</MenuList>
										</Menu>
									</>
								) : (
									<>
										<NavLink
											icon={<Icon as={FaSignInAlt} />}
											href="/login"
										>
											Login
										</NavLink>
										<NavLink
											icon={<Icon as={FaUserPlus} />}
											href="/signup"
										>
											Signup
										</NavLink>
									</>
								)}
							</Stack>
						</Box>
					) : null}
				</Container>
			</Box>
		</Headroom>
	);
}
