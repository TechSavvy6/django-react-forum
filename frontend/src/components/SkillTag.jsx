import { Badge } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const SkillTag = ({ skill }) => {
	return (
		<Link
			to={`/users/skills/${skill}`}
			style={{
				marginBottom: 3,
				marginLeft: 3,
			}}
		>
			<Badge px={2} py={1} fontSize=".8em">
				{skill}
			</Badge>
		</Link>
	);
};

export default SkillTag;
