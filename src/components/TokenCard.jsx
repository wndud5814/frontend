import { useEffect, useState } from "react";

import mintTokenAbi from "../mintTokenAbi.json";
import contractAddress from "../contractAddress.json";
import OptionCard from "./OptionCard";

const TokenCard = ({ account, web3, address, owner, walletAccount }) => {
  const [name, setName] = useState("TOKEN");
  const [symbol, setSymbol] = useState("TOKEN");
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [inputAccount, setInputAccount] = useState("");
  const [inputValue, setInputValue] = useState("0");

  const getName = async () => {
    try {
      const response = await contract.methods.name().call();

      setName(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getSymbol = async () => {
    try {
      const response = await contract.methods.symbol().call();

      setSymbol(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getBalanceOf = async () => {
    try {
      const response = await contract.methods.balanceOf(account).call();

      setBalance(Number(web3.utils.fromWei(response, "ether")));
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitSend = async (e) => {
    try {
      e.preventDefault();

      await contract.methods
        .transfer(inputAccount, web3.utils.toWei(inputValue, "ether"))
        .send({
          from: account,
        });

      getBalanceOf();

      setInputAccount("");
      setInputValue("0");
      alert("성공적으로 토큰을 전송하였습니다.");
    } catch (error) {
      console.log(error);
    }
  };

  const onClickClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(walletAccount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!contract || !account) return;

    getName();
    getSymbol();
    getBalanceOf();
  }, [contract, account]);

  useEffect(() => {
    if (!web3) return;

    setContract(new web3.eth.Contract(mintTokenAbi, address));
  }, [web3]);

  useEffect(() => console.log(inputAccount), [inputAccount]);

  return (
    <li className="flex flex-col gap-1 mt-4">
      <div>
        <button className="text-blue-500 underline" onClick={onClickClipBoard}>
          {owner}
        </button>
        가 발행한 코인
      </div>
      <div className="flex">
        <span className="bg-gray-100 w-48">{name}</span>
        <span className="bg-gray-300 w-60">{balance.toFixed(4)}</span>
        <span className="bg-gray-100 w-20">{symbol}</span>
        <form className="flex" onSubmit={onSubmitSend}>
          <select
            value={inputAccount}
            onChange={(e) => setInputAccount(e.target.value)}
          >
            {contractAddress.map((v, i) => (
              <OptionCard
                key={i}
                owner={v.owner}
                walletAccount={v.walletAccount}
              />
            ))}
          </select>
          <input
            className="bg-gray-100 w-32"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="bg-gray-300" type="submit">
            Send
          </button>
        </form>
      </div>
    </li>
  );
};

export default TokenCard;
