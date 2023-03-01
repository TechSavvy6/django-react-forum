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
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { FaKey } from "react-icons/fa";
import axios from "axios";
import { backendHost } from "../../config";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import MyFormTextInput from "../TextFields/MyFormTextInput";

const ChangePasswordModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	return (
		<>
			<Button
				onClick={onOpen}
				mt={2}
				leftIcon={<InfoOutlineIcon />}
				colorScheme="orange"
			>
				Change Password
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Change Password</ModalHeader>
					<ModalCloseButton />
					<Formik
						initialValues={{
							current_password: "",
							new_password: "",
							confirm_new_password: "",
						}}
						validationSchema={Yup.object({
							current_password: Yup.string()
								.min(8, "Must be atleast 8 characters")
								.max(
									20,
									"Must be Atleast 20 Characters or less"
								)
								.required("This Field is Required"),
							new_password: Yup.string()
								.min(8, "Must be atleast 8 characters")
								.max(
									20,
									"Must be Atleast 20 Characters or less"
								)
								.required("This Field is Required"),
							confirm_new_password: Yup.string()
								.min(8, "Must be atleast 8 characters")
								.max(
									20,
									"Must be Atleast 20 Characters or less"
								)
								.required("This Field is Required")
								.when("new_password", {
									is: (val) =>
										val && val.length > 0 ? true : false,
									then: Yup.string().oneOf(
										[Yup.ref("new_password")],
										"Password does not match"
									),
								}),
						})}
						onSubmit={(
							{ current_password, new_password },
							{ setSubmitting, resetForm, setFieldError }
						) => {
							axios
								.post(
									backendHost +
										"/api/authentication/users/set_password/",
									{
										current_password,
										new_password,
									}
								)
								.then((res) => {
									resetForm();
									setSubmitting(false);
									onClose();
									toast({
										title: "Password Successfully Changed",
										status: "success",
										duration: 20000,
										isClosable: true,
									});
								})
								.catch(({ response }) => {
									let errors = response.data;
									let errorKeys = Object.keys(errors);
									errorKeys.map((val) => {
										if (Array.isArray(errors[val])) {
											setFieldError(val, errors[val][0]);
											return null;
										} else {
											setFieldError(val, errors[val]);
											return null;
										}
									});
									setSubmitting(false);
								});
						}}
					>
						{(props) => (
							<Form>
								<ModalBody>
									<MyFormTextInput
										label="Current Password"
										name="current_password"
										type="password"
										icon={FaKey}
										placeholder="Current Password"
									/>
									<MyFormTextInput
										label="New Password"
										name="new_password"
										type="password"
										icon={FaKey}
										placeholder="New Password"
									/>
									<MyFormTextInput
										label="Confirm New Password"
										name="confirm_new_password"
										type="password"
										icon={FaKey}
										placeholder="Confirm New Password"
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										isLoading={props.isSubmitting}
										type="submit"
										mr={3}
										colorScheme="orange"
									>
										Change Password
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

export default ChangePasswordModal;
