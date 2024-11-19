import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export const SOCAIL_MEDIA_Context = createContext();

export const SOCAIL_MEDIA_Provider = ({ children }) => {
  // State variables
  const [userAddress, setUserAddress] = useState('');
  const [connected, setConnected] = useState('NOT_CONNECTED');
  const [loader, setLoader] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [activeComponent, setActiveComponent] = useState('Newsfeed');
  const [openComment, setOpenComment] = useState(false);
  const [count, setCount] = useState(0);

  // Mock data for demo
  const AppUsers = [];
  const AllAppPost = [];
  const AppUserPost = [];
  const userFollowers = [];
  const userFollowing = [];
  const memberGroups = [];
  const userAccount = null;

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setUserAddress(accounts[0]);
        setConnected('CONNECTED');
        toast.success("Wallet connected successfully!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  // Initialize contract
  const INITAIL_CONTRACT = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask");
        return;
      }

      await connectWallet();
      toast.success("Contract initialized!");
    } catch (error) {
      console.error("Error initializing contract:", error);
      toast.error("Failed to initialize contract");
    }
  };

  // Mock functions for demo
  const CREATE_ACCOUNT = async () => {
    try {
      setLoader(true);
      // Implementation would go here
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account");
    } finally {
      setLoader(false);
    }
  };

  const CREATE_POST = async () => {
    try {
      setLoader(true);
      // Implementation would go here
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setLoader(false);
    }
  };

  // Return context provider
  return (
    <SOCAIL_MEDIA_Context.Provider
      value={{
        INITAIL_CONTRACT,
        CREATE_ACCOUNT,
        CREATE_POST,
        connected,
        setConnected,
        connectWallet,
        AllAppPost,
        AppUsers,
        AppUserPost,
        userAccount,
        userFollowers,
        userFollowing,
        memberGroups,
        loader,
        openCreatePost,
        setOpenCreatePost,
        userAddress,
        setUserAddress,
        activeComponent,
        setActiveComponent,
        openComment,
        setOpenComment,
        count,
      }}
    >
      {children}
    </SOCAIL_MEDIA_Context.Provider>
  );
};
