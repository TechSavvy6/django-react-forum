import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import ForgetPasswordSVG from "../assets/svgs/ForgetPassword.svg";

import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import BaseFormSVG from "../components/BaseFormSVG";
import { tokenContext } from "../stores/Token";
import { Redirect, useParams } from "react-router";
import axios from "axios";
import { backendHost } from "../config";
import { FaLock, FaKey } from "react-icons/fa";
import { useToast } from "@chakra-ui/toast";
import { Button } from "@chakra-ui/react";

const ForgetPasswordConfirm = () => {
	const [token] = useContext(tokenContext);
	const toast = useToast();
	const params = useParams();

	return token === null ? (
		<BaseFormSVG svg={ForgetPasswordSVG}>
			<Formik
				initialValues={{
					new_password: "",
					confirm_new_password: "",
				}}
				validationSchema={Yup.object({
					new_password: Yup.string()
						.min(8, "Must be atleast 8 characters")
						.max(20, "Must be Atleast 20 Characters or less")
						.required("This Field is Required"),
					confirm_new_password: Yup.string()
						.min(8, "Must be atleast 8 characters")
						.max(20, "Must be Atleast 20 Characters or less")
						.required("This Field is Required")
						.when("new_password", {
							is: (val) => (val && val.length > 0 ? true : false),
							then: Yup.string().oneOf(
								[Yup.ref("new_password")],
								"Password does not match"
							),
						}),
				})}
				onSubmit={(
					{ new_password },
					{ setSubmitting, resetForm, setFieldError }
				) => {
					axios
						.post(
							backendHost +
								"/api/authentication/users/reset_password_confirm/",
							{
								uid: params.uid,
								token: params.token,
								new_password,
							}
						)
						.then((res) => {
							resetForm();
							toast({
								title: "Password Reset Successful",
								status: "success",
								duration: 20000,
								isClosable: true,
							});
							setSubmitting(false);
						})
						.catch(({ response }) => {
							let errors = response.data;
							let errorKeys = Object.keys(errors);
							errorKeys.forEach((val) => {
								if (Array.isArray(errors[val]))
									setFieldError(
										"new_password",
										errors[val][0]
									);
								else setFieldError("new_password", errors[val]);
							});
							setSubmitting(false);
						});
				}}
			>
				{(props) => (
					<Form>
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
						<Button
							mt={4}
							isFullWidth={true}
							isLoading={props.isSubmitting}
							type="submit"
							leftIcon={<FaLock />}
						>
							Reset Password
						</Button>
					</Form>
				)}
			</Formik>
		</BaseFormSVG>
	) : (
		<Redirect to="/" />
	);
};

export default ForgetPasswordConfirm;
