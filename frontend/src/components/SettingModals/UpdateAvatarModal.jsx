import React, { useState, useCallback } from "react";
import ReactCrop from "react-image-crop";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	chakra,
	Link,
	useToast,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { backendHost } from "../../config";
import { useContext } from "react";
import { userContext } from "../../stores/User";
import { UpdateProfilePicture } from "../../stores/actions/UserActions";

function base64StringtoFile(base64String, filename) {
	var arr = base64String.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
}

function extractImageFileExtensionFromBase64(base64Data) {
	return base64Data.substring(
		"data:image/".length,
		base64Data.indexOf(";base64")
	);
}

const UpdateAvatarModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [, userDispatch] = useContext(userContext);
	const toast = useToast();

	const [imgSrc, setImgSrc] = useState(null);
	const [image, setImage] = useState(null);
	const [imgSrcExt, setImgSrcExt] = useState(null);
	const [crop, setCrop] = useState({
		aspect: 1 / 1,
		unit: "px",
		x: 0,
		y: 0,
		width: 100,
		height: 100,
	});

	const onDrop = useCallback((files) => {
		if (files && files.length > 0) {
			const currentFile = files[0];
			const reader = new FileReader();
			reader.onload = () => {
				setImgSrc(reader.result);
				setImgSrcExt(
					extractImageFileExtensionFromBase64(reader.result)
				);
			};
			reader.readAsDataURL(currentFile);
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: "image/jpeg,image/png,image/x-png,image/jpg",
	});

	const getCroppedImage = () => {
		const canvas = document.createElement("canvas");
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = crop.width;
		canvas.height = crop.height;
		const ctx = canvas.getContext("2d");

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);

		try {
			const croppedBase64Image = canvas.toDataURL("image/jpeg");
			const filename = "technota_profile_pic." + imgSrcExt;
			const croppedImageFile = base64StringtoFile(
				croppedBase64Image,
				filename
			);
			let data = new FormData();
			data.append("image", croppedImageFile, croppedImageFile.name);
			axios
				.put(backendHost + "/api/users/profile-picture/", data)
				.then((res) => {
					userDispatch(UpdateProfilePicture(res.data.image));
					onClose();
					setImgSrc(null);
					toast({
						title: "Avatar Successfully Updated",
						status: "success",
						duration: 20000,
						isClosable: true,
					});
				})
				.catch((err) => console.log(err.response));
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<>
			<Button onClick={onOpen}>Update Avatar</Button>

			<Modal
				isOpen={isOpen}
				onClose={() => {
					onClose();
					setImgSrc(null);
				}}
				size="xl"
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Update Avatar</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{!imgSrc ? (
							<chakra.div
								borderWidth="4px"
								borderStyle="dashed"
								rounded="md"
								textAlign="center"
								p={6}
								{...getRootProps()}
							>
								<input {...getInputProps()} />
								{isDragActive ? (
									<p>Drop the files here ...</p>
								) : (
									<p>
										Drag or drop some files here, or click
										to <Link href="#">Select Files</Link>
									</p>
								)}
							</chakra.div>
						) : (
							<>
								<ReactCrop
									src={imgSrc}
									crop={crop}
									onChange={(crop) => setCrop(crop)}
									onImageLoaded={setImage}
								/>
							</>
						)}
					</ModalBody>

					<ModalFooter>
						{imgSrc ? (
							<Button mr={3} onClick={getCroppedImage}>
								Update
							</Button>
						) : null}

						<Button
							colorScheme="gray"
							onClick={() => {
								onClose();
								setImgSrc(null);
							}}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateAvatarModal;
