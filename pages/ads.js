import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ads.module.css';
import nftAdsData from '../Ads/nftAds.json';

const Ads = () => {
  const [nftAds, setNftAds] = useState([]);

  useEffect(() => {
    setNftAds(nftAdsData);
  }, []);

  const getChainFromLink = (link) => {
    if (link.includes('matic')) return 'POLYGON';
    if (link.includes('arbitrum')) return 'ARBITRUM';
    if (link.includes('base')) return 'BASE';
    if (link.includes('blast')) return 'BLAST';
    return 'EVM';
  };

  return (
    <div className={styles.adsContainer}>
      {/* Navigation */}
      <header className={styles.header}>
        <nav className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            OneNess AI NFT
          </Link>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/ads" className={styles.navLink}>NFT Marketplace</Link>
            <Link href="/tokens" className={styles.navLink}>Trending Tokens</Link>
            <a href="https://www.onenessswap.com" target="_blank" className={styles.navLink}>OneNess Swap</a>
            <a href="https://www.onenessblockchain.ai" target="_blank" className={styles.navLink}>OneNessBlockchain.AI</a>
            <a href="https://www.onenesscoder.com" target="_blank" className={styles.navLink}>OneNess Coder</a>
            <a href="https://openqsolanamemecoin.onrender.com" target="_blank" className={styles.navLink}>Buy OpenQ MemeCoin</a>
            <a href="https://onenessfaucet.onrender.com" target="_blank" className={styles.navLink}>1Ness Faucet</a>
            <a href="https://bit.ly/oneness999" target="_blank" className={styles.navLink}>Download OneNess</a>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.headerTitle}>AI NFT Marketplace</h1>
          <p className={styles.headerDescription}>
            Discover unique AI-generated NFTs across multiple EVM chains
          </p>
        </div>

        <div className={styles.grid}>
          {nftAds.map((ad) => (
            <div key={ad.productId} className={styles.card}>
              <div className={styles.chainBadge}>
                {getChainFromLink(ad.Link)}
              </div>
              <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={`/${ad.brand}`}
                    alt={ad.name}
                    width={400}
                    height={400}
                    style={{ objectFit: 'cover' }}
                    priority={ad.productId <= 4}
                  />
                </div>
              </div>
              <div className={styles.content}>
                <h2 className={styles.title}>{ad.name}</h2>
                <p className={styles.price}>{ad.price}</p>
                <a 
                  href={ad.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View on OpenSea
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 3D Shapes Background */}
      <div className="shape-container">
        <div className="shape cube" style={{ top: '10%', left: '10%' }}></div>
        <div className="shape pyramid" style={{ top: '30%', right: '15%' }}></div>
        <div className="shape cube" style={{ bottom: '20%', left: '20%' }}></div>
        <div className="shape pyramid" style={{ bottom: '15%', right: '10%' }}></div>
      </div>
    </div>
  );
};

export default Ads;
