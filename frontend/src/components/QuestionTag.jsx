import { Badge } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const QuestionTag = ({ topic }) => {
	return (
		<Link
			to={`/explore/${topic.name}-${topic.slug}`}
			style={{
				marginBottom: 3,
				marginLeft: 3,
			}}
		>
			<Badge px={2} py={1} fontSize=".8em">
				{topic.name}
			</Badge>
		</Link>
	);
};

export default QuestionTag;
