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
import { UpdateBio } from "../../stores/actions/UserActions";
import MyFormTextareaInput from "../TextFields/MyFormTextAreaInput";

const EditBioModal = () => {
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
				<ModalContent>
					<ModalHeader>Edit Bio</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							bio: user.profile.bio ? user.profile.bio : "",
						}}
						validationSchema={Yup.object({
							bio: Yup.string()
								.min(5, "Must be atleast 5 characters")
								.max(
									100,
									"Must be Atleast 100 Characters or less"
								)
								.required("This Field is Required"),
						})}
						onSubmit={(
							{ bio },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							axios
								.put(backendHost + "/api/users/bio/", {
									bio,
								})
								.then((res) => {
									resetForm();
									setSubmitting(false);
									onClose();
									userDispatch(UpdateBio(bio));
									toast({
										title: "Bio Successfully Updated",
										status: "success",
										duration: 20000,
										isClosable: true,
									});
								})
								.catch((err) => {
									setSubmitting(false);
									setFieldError("bio", "Error Occured");
								});
						}}
					>
						{(props) => (
							<Form>
								<ModalBody>
									<MyFormTextareaInput
										label="Bio"
										name="bio"
										placeholder="Bio"
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

export default EditBioModal;
