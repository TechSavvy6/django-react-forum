const UserReducer = (state, { type, payload }) => {
	switch (type) {
		case "SET_USER":
			return payload;

		case "UPDATE_SKILLS":
			return {
				...state,
				profile: {
					...state.profile,
					skills: payload,
				},
			};

		case "UPDATE_BIO":
			return {
				...state,
				profile: {
					...state.profile,
					bio: payload,
				},
			};

		case "UPDATE_PROFILE_PICTURE":
			return {
				...state,
				profile: {
					...state.profile,
					image: payload,
				},
			};

		case "DELETE_USER_STATE":
			return null;

		default:
			throw new Error();
	}
};

export default UserReducer;
