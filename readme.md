<p>The Decentralized Lending System is a blockchain-based application that enables users to lend and borrow funds directly without the involvement of a central authority such as a bank. Traditional lending systems rely on intermediaries to manage transactions, verify users, and enforce rules. These centralized systems often involve delays, high fees, and limited transparency</p>
<hr>

<h1> To run this program </h1>

1. Clone the project
   -> git clone https://github.com/Venkatesh200510/lending-dapp.git

   -> npm install

   -> npx hardhat node
   <strong>imp: It will generate the fake accounts containing Ethereum.
   Copy any one account private key .</strong>

2. In New Terminal
   -> npx hardhat run scripts/deploy.js --network localhost
   <strong>Copy the string generated after this command and paste it in App.js -> contractAddress </strong>

3. For Frontend (Reacts.js) in new terminal
   -> cd frontend

   -> npm install

   -> npm start

<strong>imp: If not installed correctly </strong>

-> npm install -D tailwindcss postcss autoprefixer

-> npx tailwind init -p

<h2>To Connect Wallet</h2>

<p>Open MetaMask in browser and then sign in </p>
 
 In MetaMask application you can see navigation bar 
 click on it and navigate to Networks -> Add custom networks
<ul>
<li>Network name : Hardhat Local</li>
<li>Default RPC URL : http://localhost:8545</li>
<li>Chain ID : 31337</li>
<li>Currency symbol : ETH</li>
</ul>
After adding new network
click on Accounts -> Add Wallets -> Import an account
Enter the private key which is copied during first step
