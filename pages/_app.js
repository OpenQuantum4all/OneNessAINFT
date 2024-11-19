import Head from "next/head";
import { SOCAIL_MEDIA_Provider } from "../context/context";
import toast, { Toaster } from "react-hot-toast";

// Import global styles
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>OneNess AI NFT</title>
        <meta name="description" content="AI-powered NFT platform on multiple chains" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <SOCAIL_MEDIA_Provider>
        <div className="app-container">
          <Component {...pageProps} />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'var(--hologram-primary)',
                border: '1px solid var(--hologram-primary)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
        </div>
      </SOCAIL_MEDIA_Provider>

      {/* Dynamic 3D Background */}
      <div className="dynamic-background">
        <div className="gradient-overlay"></div>
        <div className="particles"></div>
      </div>

      {/* Add custom styles for dynamic background */}
      <style jsx global>{`
        .dynamic-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            rgba(0, 4, 40, 0.9),
            rgba(0, 78, 146, 0.9)
          );
        }

        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at center, var(--hologram-primary) 1px, transparent 1px),
            radial-gradient(circle at center, var(--hologram-secondary) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px;
          animation: particleMove 20s linear infinite;
        }

        @keyframes particleMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-40px, -40px);
          }
        }

        .app-container {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}
