import React from "react";
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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import axios from "axios";
import { backendHost } from "./../config";
import MyFormTextareaInput from "./TextFields/MyFormTextAreaInput";
import { EditIcon } from "@chakra-ui/icons";
import MyFormTextInput from "./TextFields/MyFormTextInput";

const EditQuestionModal = ({ question, fetchQuestions }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	return (
		<>
			<IconButton
				aria-label="edit-question"
				onClick={onOpen}
				size="sm"
				mr={1}
				colorScheme="orange"
				icon={<EditIcon />}
			></IconButton>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>Edit Question</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							title: question.title,
							content: question.content,
							tags: question.tags
								.map((obj) => obj.name)
								.toString(),
						}}
						validationSchema={Yup.object({
							title: Yup.string()
								.min(10, "Must be atleast 10 characters")
								.max(
									250,
									"Must be Atleast 250 Characters or less"
								)
								.required("This Field is Required"),
							content: Yup.string()
								.max(
									1000,
									"Must be Atleast 1000 Characters or less"
								)
								.required("This Field is Required"),
							tags: Yup.string()
								.max(
									150,
									"Must be Atleast 150 Characters or less"
								)
								.required("This Field is Required"),
						})}
						onSubmit={(
							{ title, content, tags },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							let tagsArray = tags.split(",").map((str) => ({
								name: str,
							}));
							axios
								.put(
									backendHost +
										`/api/forum/questions/${question.slug}/`,
									{
										title,
										content,
										tags: tagsArray,
									}
								)
								.then((res) => {
									resetForm();
									setSubmitting(false);
									fetchQuestions();
									onClose();
									toast({
										title: "Question Updated Sucessfully",
										status: "success",
										duration: 20000,
										isClosable: true,
									});
								})
								.catch(({ response }) => {
									setSubmitting(false);
									if (response) {
										let errors = response.data;
										let errorKeys = Object.keys(errors);
										errorKeys.map((val) => {
											if (Array.isArray(errors[val])) {
												setFieldError(
													val,
													errors[val][0]
												);
												return null;
											} else {
												setFieldError(val, errors[val]);
												return null;
											}
										});
									}
								});
						}}
					>
						{(props) => (
							<Form>
								<ModalBody>
									<MyFormTextInput
										label="Title"
										name="title"
										placeholder="Title"
										maxLength={250}
									/>
									<MyFormTextareaInput
										label="Content"
										name="content"
										placeholder="Content"
										maxLength={1000}
									/>
									<MyFormTextareaInput
										label="Tags"
										name="tags"
										placeholder="Tags"
										maxLength={150}
										helpText="Seprate each tag with comma"
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
										colorScheme="orange"
										mr={3}
									>
										Edit
									</Button>
									<Button
										colorScheme="gray"
										onClick={onClose}
									>
										Close
									</Button>
								</ModalFooter>
							</Form>
						)}
					</Formik>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditQuestionModal;
