import React from "react";
import { Link, useColorModeValue } from "@chakra-ui/react";

const TextLink = ({ text, to }, props) => {
	return (
		<Link fontWeight="semibold" color={useColorModeValue("primary.500", "primary.100")} href={to} {...props}>
			{text}
		</Link>
	);
};

export default TextLink;
