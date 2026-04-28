let provider;
let signer;
let contract;

const contractAddress = "PASTE_YOUR_CONTRACT_ADDRESS";

const abi = [
  "function deposit() payable",
  "function borrow(uint amount) payable",
  "function repay() payable"
];

async function connectWallet() {
  await window.ethereum.request({ method: "eth_requestAccounts" });

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  contract = new ethers.Contract(contractAddress, abi, signer);

  alert("Wallet connected");
}

async function deposit() {
  const amount = document.getElementById("depositAmount").value;

  await contract.deposit({
    value: ethers.utils.parseEther(amount)
  });
}

async function borrow() {
  const amount = document.getElementById("borrowAmount").value;

  await contract.borrow(
    ethers.utils.parseEther(amount),
    {
      value: ethers.utils.parseEther(amount * 1.5) // collateral
    }
  );
}

async function repay() {
  const amount = document.getElementById("repayAmount").value;

  await contract.repay({
    value: ethers.utils.parseEther(amount)
  });
}