import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import TokenCard from "./components/TokenCard";
import contractAddress from "./contractAddress.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState();

  const { sdk, provider } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {account ? (
        <>
          <div>
            Hello, {account.substring(0, 7)}...
            {account.substring(account.length - 5)}
          </div>
          <ul className="my-8">
            {contractAddress.map((v, i) => (
              <TokenCard
                key={i}
                account={account}
                web3={web3}
                address={v.address}
                owner={v.owner}
                walletAccount={v.walletAccount}
              />
            ))}
          </ul>
          <button onClick={() => setAccount("")}>🦊 MetaMask Logout</button>
        </>
      ) : (
        <button onClick={onClickMetaMask}>🦊 MetaMask Login</button>
      )}
    </div>
  );
};

export default App;
