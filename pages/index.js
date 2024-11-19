import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for holographic effect
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.mainLayout}>
      <header className={styles.header}>
        <nav className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            OneNess AI NFT
          </Link>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/ai-nft" className={styles.navLink}>AI NFT</Link>
            <Link href="/ads" className={styles.navLink}>NFT Marketplace</Link>
          </div>
        </nav>
      </header>

      <main className={styles.mainContent}>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : (
          <>
            <div className={styles.hologramContainer}>
              <h1 className={styles.title}>
                Welcome to OneNess AI NFT
              </h1>
              <p className={styles.description}>
                Explore the future of digital assets with AI-powered NFTs across multiple EVM chains
              </p>
              
              {/* Navigation Links */}
              <div className={styles.linkGrid}>
                <a href="https://www.onenessswap.com" target="_blank" className="hologram-btn">
                  OneNess Swap
                </a>
                <a href="https://www.onenessblockchain.ai" target="_blank" className="hologram-btn">
                  OneNessBlockchain.AI
                </a>
                <a href="https://bit.ly/oneness999" target="_blank" className="hologram-btn">
                  Download OneNess
                </a>
              </div>

              {/* Features Grid */}
              <div className={styles.featureGrid}>
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>AI-Powered NFTs</h3>
                  <p>Create and interact with intelligent NFTs using advanced AI technology</p>
                </div>
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>Multi-Chain Support</h3>
                  <p>Compatible with multiple EVM chains including Polygon, Arbitrum, Base, and more</p>
                </div>
                <div className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>NFT Marketplace</h3>
                  <p>Browse and collect unique AI-generated NFTs from various creators</p>
                </div>
              </div>

              {/* CTA Section */}
              <div className={styles.ctaSection}>
                <Link href="/ads" className="hologram-btn" style={{ marginRight: '1rem' }}>
                  Explore NFT Marketplace
                </Link>
                <Link href="/ai-nft" className="hologram-btn">
                  Launch AI NFT Interface
                </Link>
              </div>
            </div>

            {/* 3D Shapes Background */}
            <div className="shape-container">
              <div className="shape cube" style={{ top: '10%', left: '10%' }}></div>
              <div className="shape pyramid" style={{ top: '30%', right: '15%' }}></div>
              <div className="shape cube" style={{ bottom: '20%', left: '20%' }}></div>
              <div className="shape pyramid" style={{ bottom: '15%', right: '10%' }}></div>
            </div>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>© 2024 OneNess AI NFT. All rights reserved.</div>
          <div className={styles.navLinks}>
            <a href="https://www.onenessblockchain.ai" target="_blank" className={styles.navLink}>About</a>
            <a href="https://bit.ly/oneness999" target="_blank" className={styles.navLink}>Download</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
