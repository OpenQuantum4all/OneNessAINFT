import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Link from 'next/link';
import styles from './ai-nft.module.css';

// Minimal ERC721 ABI with necessary functions
const ERC721_ABI = [
  'function tokenURI(uint256) view returns (string)',
  'function ownerOf(uint256) view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)'
];

const AINFT = () => {
  const [apiKey, setApiKey] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [nftMetadata, setNftMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [error, setError] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [loadingState, setLoadingState] = useState('');
  
  // Speech Recognition States
  const [isRecording, setIsRecording] = useState(false);
  const [voiceGender, setVoiceGender] = useState('female');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    checkWalletConnection();
    initializeSpeechFeatures();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        setIsWalletConnected(accounts.length > 0);
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask to use this feature');
        return;
      }

      setLoadingState('Connecting wallet...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      setIsWalletConnected(true);
      setError('');
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    } finally {
      setLoadingState('');
    }
  };

  const initializeSpeechFeatures = () => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setChatInput(transcript);
        };

        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognitionRef.current = recognition;
      }

      // Speech Synthesis
      if ('speechSynthesis' in window) {
        speechSynthesisRef.current = window.speechSynthesis;
      }
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setChatInput('');
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const speakText = (text) => {
    if (!speechSynthesisRef.current || !text) return;

    speechSynthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voiceGender === 'female') {
      utterance.lang = 'en-US';
      utterance.pitch = 100.0;
      utterance.rate = 1.0;
      utterance.volume = 1.0;
    } else {
      utterance.lang = 'en-US';
      utterance.pitch = 0.1;
      utterance.rate = 0.9;
      utterance.volume = 1.0;
    }
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    
    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsPlaying(false);
    }
  };

  const validateInputs = () => {
    if (!ethers.utils.isAddress(nftAddress)) {
      throw new Error('Invalid NFT contract address');
    }
    if (!tokenId || isNaN(tokenId)) {
      throw new Error('Invalid Token ID');
    }
  };

  const loadNFTData = async () => {
    setError('');
    setLoadingState('');
    setNftMetadata(null);

    try {
      // Input validation
      validateInputs();

      // Wallet connection check
      if (!isWalletConnected) {
        await connectWallet();
      }

      setLoadingState('Connecting to contract...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Contract verification
      const nftContract = new ethers.Contract(nftAddress, ERC721_ABI, signer);
      
      // Basic contract validation
      setLoadingState('Validating contract...');
      try {
        await nftContract.name();
      } catch (err) {
        throw new Error('Invalid NFT contract - missing required ERC721 functions');
      }

      // Fetch token data
      setLoadingState('Fetching token data...');
      try {
        await nftContract.ownerOf(tokenId);
      } catch (err) {
        throw new Error('Token ID does not exist');
      }

      const tokenURI = await nftContract.tokenURI(tokenId);
      
      // Fetch metadata
      setLoadingState('Fetching metadata...');
      let metadata;
      if (tokenURI.startsWith('ipfs://')) {
        const ipfsHash = tokenURI.replace('ipfs://', '');
        const response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`);
        metadata = response.data;
      } else {
        const response = await axios.get(tokenURI);
        metadata = response.data;
      }

      // Validate metadata
      if (!metadata || typeof metadata !== 'object') {
        throw new Error('Invalid metadata format');
      }

      // Process image URL
      if (metadata.image) {
        metadata.image = processImageUrl(metadata.image);
      }

      setNftMetadata(metadata);
      setLoadingState('');
    } catch (err) {
      setError(err.message || 'Failed to load NFT data');
      setLoadingState('');
    }
  };

  const processImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    if (url.startsWith('ar://')) {
      return `https://arweave.net/${url.replace('ar://', '')}`;
    }
    return url;
  };

  const handleChat = async () => {
    if (!apiKey || !chatInput) return;

    setIsLoading(true);
    setError('');

    try {
      const systemPrompt = nftMetadata ? 
        `You are an AI assistant for the NFT with the following metadata:
Name: ${nftMetadata.name}
Description: ${nftMetadata.description}
Attributes: ${JSON.stringify(nftMetadata.attributes)}
Please provide information and insights about this NFT.` :
        'You are an AI assistant for NFTs. Please provide general information about NFTs.';

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: chatInput }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const assistantResponse = response.data.choices[0].message.content;
      
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: chatInput },
        { role: 'assistant', content: assistantResponse }
      ]);
      
      if (isPlaying) {
        speakText(assistantResponse);
      }
      
      setChatInput('');
    } catch (err) {
      setError('Failed to get AI response: ' + (err.response?.data?.error?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

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
            <a href="https://www.onenessswap.com" target="_blank" className={styles.navLink}>OneNess Swap</a>
            <a href="https://www.onenessblockchain.ai" target="_blank" className={styles.navLink}>OneNessBlockchain.AI</a>
            <a href="https://bit.ly/oneness999" target="_blank" className={styles.navLink}>Download OneNess</a>
          </div>
        </nav>
      </header>

      <div className={styles.card}>
        <div className="card-body">
          <h2 className={styles.cardTitle}>AI NFT Chat</h2>

          {!isWalletConnected && (
            <div className={styles.walletPrompt}>
              <button 
                className={styles.connectButton}
                onClick={connectWallet}
                disabled={loadingState === 'Connecting wallet...'}
              >
                {loadingState === 'Connecting wallet...' ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          )}
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {loadingState && (
            <div className={styles.loadingMessage}>
              {loadingState}
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label>OpenAI API Key</label>
            <input
              type="password"
              className={styles.formControl}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
            />
          </div>

          <div className={styles.formGroup}>
            <label>NFT Contract Address</label>
            <input
              type="text"
              className={styles.formControl}
              value={nftAddress}
              onChange={(e) => {
                setNftAddress(e.target.value);
                setError('');
              }}
              placeholder="Enter NFT contract address"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Token ID</label>
            <input
              type="text"
              className={styles.formControl}
              value={tokenId}
              onChange={(e) => {
                setTokenId(e.target.value);
                setError('');
              }}
              placeholder="Enter token ID"
            />
          </div>

          <button
            className={`${styles.loadButton} ${(!nftAddress || !tokenId || loadingState) ? styles.disabled : ''}`}
            onClick={loadNFTData}
            disabled={!nftAddress || !tokenId || !!loadingState}
          >
            {loadingState || 'Load NFT'}
          </button>

          {nftMetadata && (
            <div className={styles.nftMetadata}>
              <h4>NFT Details</h4>
              {nftMetadata.image && (
                <div className={styles.nftImageContainer}>
                  <img 
                    src={nftMetadata.image} 
                    alt={nftMetadata.name || 'NFT Image'} 
                    className={styles.nftImage}
                    onClick={() => setShowImageModal(true)}
                  />
                </div>
              )}
              <pre>{JSON.stringify(nftMetadata, null, 2)}</pre>
            </div>
          )}

          {showImageModal && nftMetadata?.image && (
            <div 
              className={styles.nftImageModal}
              onClick={() => setShowImageModal(false)}
            >
              <img 
                src={nftMetadata.image} 
                alt={nftMetadata.name || 'NFT Image'} 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className={styles.chatContainer}>
            <div className={styles.chatHistory}>
              {chatHistory.map((msg, index) => (
                <div key={index} className={`${styles.chatMessage} ${styles[msg.role]}`}>
                  <strong>{msg.role}:</strong> {msg.content}
                </div>
              ))}
            </div>

            <div className={styles.chatInput}>
              <textarea
                className={styles.formControl}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message or click 'Start Recording' to use voice..."
                rows="3"
              />
              <div className={styles.chatActions}>
                <div className={styles.audioControls}>
                  <button 
                    className={`${styles.switchButton} ${voiceGender === 'female' ? styles.active : ''}`}
                    onClick={() => setVoiceGender('female')}
                  >
                    Female
                  </button>
                  <button 
                    className={`${styles.switchButton} ${voiceGender === 'male' ? styles.active : ''}`}
                    onClick={() => setVoiceGender('male')}
                  >
                    Male
                  </button>
                  <button 
                    className={`${styles.switchButton} ${isRecording ? styles.active : ''}`}
                    onClick={toggleRecording}
                  >
                    {isRecording ? '⏹️' : '🎤'}
                    {isRecording && <span className={styles.recordingIndicator} />}
                  </button>
                  <button 
                    className={`${styles.switchButton} ${isPlaying ? styles.active : ''}`}
                    onClick={() => isPlaying ? stopSpeaking() : speakText(chatHistory[chatHistory.length - 1]?.content)}
                  >
                    {isPlaying ? '⏹️' : '🔊'}
                  </button>
                </div>
                <button
                  className={`${styles.chatButton} ${(!apiKey || !chatInput || isLoading) ? styles.disabled : ''}`}
                  onClick={handleChat}
                  disabled={!apiKey || !chatInput || isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default AINFT;

