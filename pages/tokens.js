import Link from 'next/link';
import Image from 'next/image';
import styles from './tokens.module.css';
import tokenData from '../Ads/tokenAds.json';

const Tokens = () => {
  return (
    <div className={styles.container}>
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

      <main>
        <div className={styles.header}>
          <h1 className={styles.title}>Trending Tokens</h1>
          <p className={styles.description}>
            Explore the hottest tokens in the crypto space. From established cryptocurrencies to emerging gems.
          </p>
        </div>

        <div className={styles.grid}>
          {tokenData.map((token) => (
            <div key={token.productId} className={styles.card}>
              <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={`/${token.brand}`}
                    alt={token.name}
                    width={400}
                    height={400}
                    style={{ objectFit: 'cover' }}
                    priority={token.productId <= 4}
                  />
                </div>
              </div>
              <div className={styles.content}>
                <h2 className={styles.name}>{token.name}</h2>
                {token.price && <p className={styles.price}>{token.price}</p>}
                <a 
                  href={token.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {token.price ? 'Trade Now' : 'View on Coinbase'}
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

export default Tokens;
