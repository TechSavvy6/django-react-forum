import React from "react";
import { useField } from "formik";
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	InputGroup,
	Textarea,
	FormHelperText,
} from "@chakra-ui/react";

const MyFormTextareaInput = ({ label, helpText, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			<FormControl
				mt={2}
				isInvalid={
					meta.touched && meta.error ? <div>{meta.error}</div> : null
				}
			>
				<FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
				<InputGroup>
					<Textarea {...field} {...props} />
				</InputGroup>
				<FormErrorMessage>
					{meta.touched && meta.error ? meta.error : null}
				</FormErrorMessage>
				<FormHelperText>{helpText ? helpText : null}</FormHelperText>
			</FormControl>
		</>
	);
};

export default MyFormTextareaInput;
