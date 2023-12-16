import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
