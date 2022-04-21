import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import 'bootstrap/dist/css/bootstrap.css';

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider 
      appId="aFUE8VcAvkpIuQGKexiqbaoDDi2FL8JJ7ZKtuRZd"
     serverUrl="https://z7ybm1vehe6u.usemoralis.com:2053/server">
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;