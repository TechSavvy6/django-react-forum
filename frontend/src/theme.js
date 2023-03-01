import { extendTheme, withDefaultColorScheme, withDefaultVariant } from "@chakra-ui/react";

export const colors = {
	white: "#ffffff",
	primary: {
		50: "#dcf3ff",
		100: "#aed7ff",
		200: "#7dbdff",
		300: "#4aa2ff",
		400: "#1a87ff",
		500: "#006ee6",
		600: "#0055b4",
		700: "#003d82",
		800: "#002551",
		900: "#000d21",
	},
};

const fonts = {
	heading: "Raleway",
	body: "Montserrat",
};

const config = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

const styles = {
	global: (props) => ({
		"::-webkit-scrollbar": {
			width: "8px",
			backgroundColor: "#dcf3ff",
		},
		"::-webkit-scrollbar-thumb": {
			backgroundColor: props.colorMode === "dark" ? "#7dbdff" : "#006ee6",
			borderRadius: "5px",
		},
		"::-webkit-scrollbar-thumb:hover": {
			backgroundColor: props.colorMode === "dark" ? "#1a87ff" : "#0055b4",
			borderRadius: "5px",
		},
	}),
};

const theme = { colors, fonts, config, styles };

const customTheme = extendTheme(
	theme,
	withDefaultColorScheme({
		colorScheme: "primary",
		components: ["Button", "Badge", "Text"],
	}),
	withDefaultVariant({
		variant: "ghost",
		components: ["Button"],
	})
);

export default customTheme;
