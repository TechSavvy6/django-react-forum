import { Flex, Button, Icon } from "@chakra-ui/react";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ pageCount, currentPage, setCurrentPage }) => {
	const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

	return (
		<Flex py={10} alignItems="center" wrap="wrap" justifyContent="center">
			{currentPage !== 1 ? (
				<Button
					size="sm"
					m={1}
					onClick={() => setCurrentPage(currentPage - 1)}
				>
					<Icon as={IoIosArrowBack} />
				</Button>
			) : null}
			{pageNumbers.map((number, i) => {
				return (
					<Button
						size="sm"
						variant={number === currentPage ? "solid" : null}
						onClick={() => setCurrentPage(number)}
						m={1}
						key={i}
					>
						{number}
					</Button>
				);
			})}
			{currentPage !== pageCount ? (
				<Button
					m={1}
					size="sm"
					onClick={() => setCurrentPage(currentPage + 1)}
				>
					<Icon as={IoIosArrowForward} />
				</Button>
			) : null}
		</Flex>
	);
};

export default Pagination;
