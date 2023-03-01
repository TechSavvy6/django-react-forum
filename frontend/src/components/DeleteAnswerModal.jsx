import React, { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	useToast,
	IconButton,
	Text,
} from "@chakra-ui/react";
import axios from "axios";
import { backendHost } from "./../config";
import { DeleteIcon } from "@chakra-ui/icons";

const DeleteAnswerModal = ({ answer, fetchQuestion }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isDeleting, setIsDeleting] = useState(false);
	const toast = useToast();

	const deleteAnswer = () => {
		setIsDeleting(true);
		axios
			.delete(backendHost + `/api/forum/answers/${answer.id}/`)
			.then((res) => {
				setIsDeleting(false);
				onClose();
				toast({
					title: "Answer Deleted",
					status: "error",
					duration: 20000,
					isClosable: true,
				});
				fetchQuestion();
			})
			.catch((err) => {
				setIsDeleting(false);
				console.log(err.message);
			});
	};

	return (
		<>
			<IconButton
				onClick={onOpen}
				size="sm"
				colorScheme="red"
				icon={<DeleteIcon />}
			></IconButton>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>Delete Answer</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Do you want to delete answer?</Text>
					</ModalBody>
					<ModalFooter>
						<Button
							mr={3}
							isLoading={isDeleting}
							onClick={deleteAnswer}
							colorScheme="red"
						>
							Delete
						</Button>
						<Button colorScheme="gray" onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteAnswerModal;
