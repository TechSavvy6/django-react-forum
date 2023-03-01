import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Text, Box, Button } from "@chakra-ui/react";

import LoginSVG from "../assets/svgs/Login.svg";

import MyFormTextInput from "../components/TextFields/MyFormTextInput";
import BaseFormSVG from "../components/BaseFormSVG";
import { tokenContext } from "../stores/Token";
import { Redirect } from "react-router";
import axios from "axios";
import { backendHost } from "../config";
import TextLink from "../components/TextLink";
import { FaUserAlt, FaKey, FaSignInAlt } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Login = () => {
	const [token, setToken] = useContext(tokenContext);
	return token === null ? (
		<BaseFormSVG svg={LoginSVG}>
			<Helmet>
				<title>Login - Technota</title>
			</Helmet>
			<Formik
				initialValues={{
					username: "",
					password: "",
				}}
				validationSchema={Yup.object({
					username: Yup.string()
						.min(3, "Must be atleast 3 characters")
						.max(12, "Must be Atleast 12 Characters or less")
						.required("This Field is Required"),
					password: Yup.string()
						.min(8, "Must be atleast 8 characters")
						.max(20, "Must be Atleast 20 Characters or less")
						.required("This Field is Required"),
				})}
				onSubmit={(
					{ username, password },
					{ setSubmitting, resetForm, setFieldError }
				) => {
					axios
						.post(backendHost + "/api/token/", {
							username,
							password,
						})
						.then((res) => {
							setSubmitting(false);
							resetForm();
							if (res.status === 200) {
								setToken(res.data);
							}
						})
						.catch(({ response }) => {
							axios
								.get(
									backendHost +
										`/api/users/is-user-active/${username}/`
								)
								.then((res) => {
									if (res.data.is_active === false) {
										axios
											.post(
												backendHost +
													"/api/authentication/users/resend_activation/",
												{
													email: res.data.email,
												}
											)
											.then((res) => {
												if (res.status === 204) {
													setFieldError(
														"username",
														"Your Email is not verified! We have resent verification email"
													);
												}
											});
									} else {
										if (response) {
											let error = response.data?.detail;
											setFieldError("username", error);
										}
									}
								})
								.catch(({ response }) => {
									if (response) {
										let error = response.data?.detail;
										setFieldError("username", error);
									}
								});
							setSubmitting(false);
						});
				}}
			>
				{(props) => (
					<Form>
						<MyFormTextInput
							label="Username"
							name="username"
							icon={FaUserAlt}
							placeholder="Username"
						/>
						<MyFormTextInput
							label="Password"
							name="password"
							type="password"
							icon={FaKey}
							placeholder="Password"
						/>
						<Text mt={4}>
							Do Not Have Account?{" "}
							<TextLink text="Signup" to="/signup" />
						</Text>
						<Button
							mt={4}
							isLoading={props.isSubmitting}
							type="submit"
							isFullWidth={true}
							leftIcon={<FaSignInAlt />}
						>
							Login
						</Button>
						<Box mt={4}>
							<TextLink
								text="Forget Password?"
								to="/forget-password"
							/>
						</Box>
					</Form>
				)}
			</Formik>
		</BaseFormSVG>
	) : (
		<Redirect to="/" />
	);
};

export default Login;
