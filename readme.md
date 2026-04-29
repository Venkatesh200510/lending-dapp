To run this program

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

Network name : Hardhat Local
Default RPC URL : http://localhost:8545
Chain ID : 31337
Currency symbol : ETH

After adding new network
click on Accounts -> Add Wallets -> Import an account
Enter the private key which is copied during first step
