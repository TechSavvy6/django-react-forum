import React from "react";
import { useField } from "formik";
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	InputGroup,
	InputLeftElement,
	Icon,
	FormHelperText,
	InputRightElement,
} from "@chakra-ui/react";

const MyFormTextInput = ({ label, icon, helpText, rightElement, ...props }) => {
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
					{icon ? (
						<InputLeftElement pointerEvents="none">
							<Icon as={icon} color="gray.300" />
						</InputLeftElement>
					) : null}
					<Input {...field} {...props} />
					{rightElement ? (
						<InputRightElement width="4.5rem">
							{rightElement}
						</InputRightElement>
					) : null}
				</InputGroup>
				<FormErrorMessage>
					{meta.touched && meta.error ? meta.error : null}
				</FormErrorMessage>
				<FormHelperText>{helpText ? helpText : null}</FormHelperText>
			</FormControl>
		</>
	);
};

export default MyFormTextInput;
