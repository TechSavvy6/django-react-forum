import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import "@fontsource/raleway";
import "@fontsource/montserrat";
import "react-image-crop/dist/ReactCrop.css";

import { TokenProvider } from "./stores/Token";
import { UserProvider } from "./stores/User";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
	dsn: "https://0f37e6e89c46479eb93062a9acd5ac85@o1032827.ingest.sentry.io/5999809",
	integrations: [new Integrations.BrowserTracing()],
	tracesSampleRate: 1.0,
});

ReactDOM.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<TokenProvider>
				<UserProvider>
					<App />
				</UserProvider>
			</TokenProvider>
		</ChakraProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

serviceWorkerRegistration.register();

reportWebVitals();
