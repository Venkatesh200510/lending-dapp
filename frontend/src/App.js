import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  const isFetchingRef = useRef(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const abi = [
    "function createLoan(uint,uint)",
    "function fundLoan(uint) payable",
    "function repayLoan(uint) payable",
    "function getLoans() view returns (tuple(uint id,address borrower,address lender,uint amount,uint interest,bool funded,bool repaid)[])"
  ];

  // 🔗 Auto connect wallet
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;

      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);

      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) return;

      const signer = await prov.getSigner();

      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );

      setAccount(accounts[0]);
      setContract(contractInstance);

      updateData(prov, contractInstance, accounts[0]);
    };

    init();
  }, []);

  // 🔄 Controlled refresh
  useEffect(() => {
    if (!contract || !account || !provider) return;

    const interval = setInterval(() => {
      updateData(provider, contract, account);
    }, 10000);

    return () => clearInterval(interval);
  }, [contract, account, provider]);

  // 🔗 Connect Wallet
  const connectWallet = async () => {
    const prov = new ethers.BrowserProvider(window.ethereum);
    await prov.send("eth_requestAccounts", []);
    const signer = await prov.getSigner();

    const address = await signer.getAddress();

    const contractInstance = new ethers.Contract(
      contractAddress,
      abi,
      signer
    );

    setProvider(prov);
    setAccount(address);
    setContract(contractInstance);

    updateData(prov, contractInstance, address);
  };

  // 📊 Safe data fetch
  const updateData = async (prov, contractInstance, address) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const bal = await prov.getBalance(address);
      const data = await contractInstance.getLoans();

      setBalance(ethers.formatEther(bal));
      setLoans(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }

    isFetchingRef.current = false;
  };

  // 👤 Create Loan
  const createLoan = async () => {
    if (!amount || !interest) return alert("Enter values");

    setLoading(true);
    try {
      const tx = await contract.createLoan(
        ethers.parseEther(amount),
        ethers.parseEther(interest)
      );
      await tx.wait();
      setAmount("");
      setInterest("");
      updateData(provider, contract, account);
    } catch {
      alert("Failed");
    }
    setLoading(false);
  };

  // 💰 Fund Loan
  const fundLoan = async (id, amt) => {
    setLoading(true);
    try {
      const tx = await contract.fundLoan(id, { value: amt });
      await tx.wait();
      updateData(provider, contract, account);
    } catch {
      alert("Funding failed");
    }
    setLoading(false);
  };

  // 🔁 Repay Loan
  const repayLoan = async (id, amt, interest) => {
    const total = amt + interest;

    setLoading(true);
    try {
      const tx = await contract.repayLoan(id, { value: total });
      await tx.wait();
      updateData(provider, contract, account);
    } catch {
      alert("Repay failed");
    }
    setLoading(false);
  };

  // 📊 Filters
  const myLoans = loans.filter(
    (l) => account && l.borrower.toLowerCase() === account.toLowerCase()
  );

  const openLoans = loans.filter((l) => !l.funded);

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-100 font-sans">

      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="font-semibold text-lg">P2P Lending</h1>

        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-green-500 text-black px-4 py-2 rounded"
          >
            Connect
          </button>
        ) : (
          <div className="text-sm text-gray-400">
            {account.slice(0,6)}...{account.slice(-4)} | {parseFloat(balance).toFixed(4)} ETH
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto p-6">

        {/* Create Loan */}
        <div className="mb-6">
          <h2 className="mb-2 font-semibold">Create Loan</h2>
          <div className="flex gap-2">
            <input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border px-3 py-2 rounded w-full text-black"
            />
            <input
              placeholder="Interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="border px-3 py-2 rounded w-full text-black"
            />
            <button
              onClick={createLoan}
              className="bg-green-500 px-4 rounded text-black"
            >
              Create
            </button>
          </div>
        </div>

        {/* My Loans */}
        <div className="mb-6">
          <h2 className="mb-2 font-semibold">My Loans</h2>

          {myLoans.length === 0 && <p className="text-gray-500">No loans</p>}

          {myLoans.map((loan, i) => {
            const total =
              parseFloat(ethers.formatEther(loan.amount)) +
              parseFloat(ethers.formatEther(loan.interest));

            return (
              <div key={i} className="border p-3 mb-2 rounded">
                <p>Amount: {ethers.formatEther(loan.amount)} ETH</p>
                <p>Total Repay: {total.toFixed(4)} ETH</p>

                {!loan.funded && <p>Waiting for lender</p>}

                {loan.funded && !loan.repaid && (
                  <button
                    onClick={() => repayLoan(loan.id, loan.amount, loan.interest)}
                    className="bg-blue-500 px-2 py-1 mt-2"
                  >
                    Repay
                  </button>
                )}

                {loan.repaid && <p>Completed</p>}
              </div>
            );
          })}
        </div>

        {/* Marketplace */}
        <div>
          <h2 className="mb-2 font-semibold">Marketplace</h2>

          {openLoans.length === 0 && <p className="text-gray-500">No loans available</p>}

          {openLoans.map((loan, i) => (
            <div key={i} className="border p-3 mb-2 rounded">
              <p>{loan.borrower.slice(0,6)}...{loan.borrower.slice(-4)}</p>
              <p>{ethers.formatEther(loan.amount)} ETH</p>

              <button
                onClick={() => fundLoan(loan.id, loan.amount)}
                className="bg-blue-500 px-2 py-1 mt-2"
              >
                Fund
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white text-black p-4 rounded">
            Processing...
          </div>
        </div>
      )}
    </div>
  );
}

export default App;