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
import { useHistory } from "react-router-dom";

const DeleteQuestionModal = ({ question, fetchQuestions, isRedirect }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isDeleting, setIsDeleting] = useState(false);
	const toast = useToast();
	const history = useHistory();

	const deleteQuestion = () => {
		setIsDeleting(true);
		axios
			.delete(backendHost + `/api/forum/questions/${question.slug}/`)
			.then((res) => {
				setIsDeleting(false);
				onClose();
				toast({
					title: "Question Deleted",
					status: "error",
					duration: 20000,
					isClosable: true,
				});
				if (isRedirect) history.push("/");
				else fetchQuestions();
			})
			.catch((err) => {
				setIsDeleting(false);
				console.log(err.message);
			});
	};

	return (
		<>
			<IconButton
				aria-label="delete-question"
				onClick={onOpen}
				size="sm"
				colorScheme="red"
				icon={<DeleteIcon />}
			></IconButton>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>Delete Question</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>
							Do you want to delete question {question.title}?
						</Text>
					</ModalBody>
					<ModalFooter>
						<Button
							mr={3}
							isLoading={isDeleting}
							onClick={deleteQuestion}
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

export default DeleteQuestionModal;
