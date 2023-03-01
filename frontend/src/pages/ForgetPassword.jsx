import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import ForgetPasswordSVG from "../assets/svgs/ForgetPassword.svg";

import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import BaseFormSVG from "../components/BaseFormSVG";
import { tokenContext } from "../stores/Token";
import { Redirect } from "react-router";
import axios from "axios";
import { backendHost } from "../config";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useToast } from "@chakra-ui/toast";
import { Button } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

const ForgetPassword = () => {
	const [token] = useContext(tokenContext);
	const toast = useToast();

	return token === null ? (
		<BaseFormSVG svg={ForgetPasswordSVG}>
			<Helmet>
				<title>Forget Password - Technota</title>
			</Helmet>
			<Formik
				initialValues={{
					email: "",
				}}
				validationSchema={Yup.object({
					email: Yup.string()
						.email("Invalid Email")
						.required("This Field is Required"),
				})}
				onSubmit={({ email }, { setSubmitting, resetForm }) => {
					axios
						.post(
							backendHost +
								"/api/authentication/users/reset_password/",
							{
								email,
							}
						)
						.then((res) => {
							resetForm();
							toast({
								title: "Password Reset Email Sent",
								description:
									"Password Reset Email has just been sent to your email address.",
								status: "success",
								duration: 20000,
								isClosable: true,
							});
							setSubmitting(false);
						});
				}}
			>
				{(props) => (
					<Form>
						<MyFormTextInput
							label="Email"
							name="email"
							icon={FaEnvelope}
							placeholder="Email"
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

export default ForgetPassword;
