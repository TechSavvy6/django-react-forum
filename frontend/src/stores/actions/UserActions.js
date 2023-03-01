export const SetUser = (user) => {
	return {
		type: "SET_USER",
		payload: user,
	};
};

export const UpdateSkills = (skills) => {
	return {
		type: "UPDATE_SKILLS",
		payload: skills,
	};
};

export const UpdateBio = (bio) => {
	return {
		type: "UPDATE_BIO",
		payload: bio,
	};
};

export const UpdateProfilePicture = (image) => {
	return {
		type: "UPDATE_PROFILE_PICTURE",
		payload: image,
	};
};

export const DeleteUserState = () => {
	return {
		type: "DELETE_USER_STATE",
	};
};
