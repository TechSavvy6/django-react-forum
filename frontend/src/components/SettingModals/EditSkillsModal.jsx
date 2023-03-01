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
	Link,
	Icon,
	useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { backendHost } from "../../config";
import { useContext } from "react";
import { userContext } from "../../stores/User";
import MyFormTextareaInput from "../TextFields/MyFormTextAreaInput";
import { UpdateSkills } from "../../stores/actions/UserActions";

const EditSkillsModal = () => {
	const [user, userDispatch] = useContext(userContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	return (
		<>
			<Link onClick={onOpen} pl={2}>
				<Icon as={FaPencilAlt} /> Edit
			</Link>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent onTouchCancel={(e) => e.preventDefault()}>
					<ModalHeader>Edit Skills</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							skills: user.profile.skills
								? user.profile.skills.toString()
								: "",
						}}
						validationSchema={Yup.object({
							skills: Yup.string()
								.max(
									100,
									"Must be Atleast 100 Characters or less"
								)
								.required("This Field is Required"),
						})}
						onSubmit={(
							{ skills },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							let skillsArray = skills.split(",");
							axios
								.put(backendHost + "/api/users/skills/", {
									skills: skillsArray,
								})
								.then((res) => {
									resetForm();
									setSubmitting(false);
									onClose();
									userDispatch(UpdateSkills(skillsArray));
									toast({
										title: "Skills Successfully Updated",
										status: "success",
										duration: 20000,
										isClosable: true,
									});
								})
								.catch((err) => {
									setSubmitting(false);
									setFieldError("skills", "Error Occured");
								});
						}}
					>
						{(props) => (
							<Form>
								<ModalBody>
									<MyFormTextareaInput
										label="Skills"
										name="skills"
										placeholder="Skills"
										helpText="Seprate each skill with comma"
										maxLength={100}
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
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

export default EditSkillsModal;
