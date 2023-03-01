import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Text, useToast } from "@chakra-ui/react";

import SignupSVG from "../assets/svgs/Signup.svg";

import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import BaseFormSVG from "../components/BaseFormSVG";
import { tokenContext } from "../stores/Token";
import { Redirect } from "react-router";
import axios from "axios";
import { backendHost } from "../config";
import TextLink from "../components/TextLink";
import { FaUserAlt, FaEnvelope, FaKey, FaUserPlus } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Signup = () => {
	const [token] = useContext(tokenContext);
	const toast = useToast();
	return token === null ? (
		<BaseFormSVG svg={SignupSVG}>
			<Helmet>
				<title>Signup - Technota</title>
			</Helmet>
			<Formik
				initialValues={{
					username: "",
					email: "",
					password: "",
					confirm_password: "",
				}}
				validationSchema={Yup.object({
					username: Yup.string()
						.min(3, "Must be atleast 3 characters")
						.max(12, "Must be Atleast 12 Characters or less")
						.required("This Field is Required"),
					email: Yup.string()
						.email("Invalid Email")
						.required("This Field is Required"),
					password: Yup.string()
						.min(8, "Must be atleast 8 characters")
						.max(20, "Must be Atleast 20 Characters or less")
						.required("This Field is Required"),
					confirm_password: Yup.string()
						.min(8, "Must be atleast 8 characters")
						.max(20, "Must be Atleast 20 Characters or less")
						.required("This Field is Required")
						.when("password", {
							is: (val) => (val && val.length > 0 ? true : false),
							then: Yup.string().oneOf(
								[Yup.ref("password")],
								"Password does not match"
							),
						}),
				})}
				onSubmit={(
					{ username, email, password },
					{ setSubmitting, resetForm, setFieldError }
				) => {
					axios
						.post(backendHost + "/api/authentication/users/", {
							username,
							email,
							password,
						})
						.then((res) => {
							if (res.status === 201) {
								resetForm();
								toast({
									title: "Account created.",
									description:
										"Please Click on the link that has just been sent to your email address to verify your email and activate your account",
									status: "success",
									duration: 20000,
									isClosable: true,
								});
							}
							setSubmitting(false);
						})
						.catch(({ response }) => {
							if (response) {
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
							}
							setSubmitting(false);
						});
				}}
			>
				{(props) => (
					<Form>
						<MyFormTextInput
							label="Username"
							icon={FaUserAlt}
							name="username"
							placeholder="Username"
						/>
						<MyFormTextInput
							label="Email"
							name="email"
							icon={FaEnvelope}
							placeholder="example@example.com"
						/>
						<MyFormTextInput
							label="Password"
							name="password"
							type="password"
							icon={FaKey}
							placeholder="Password"
						/>
						<MyFormTextInput
							label="Confirm Password"
							name="confirm_password"
							type="password"
							icon={FaKey}
							placeholder="Confirm Password"
						/>
						<Text mt={4}>
							Already have Account?{" "}
							<TextLink text="Login" to="/login" />
						</Text>
						<Button
							mt={4}
							isLoading={props.isSubmitting}
							type="submit"
							isFullWidth={true}
							leftIcon={<FaUserPlus />}
						>
							Signup
						</Button>
					</Form>
				)}
			</Formik>
		</BaseFormSVG>
	) : (
		<Redirect to="/" />
	);
};

export default Signup;
