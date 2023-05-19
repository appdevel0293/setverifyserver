const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());



const privateKey = fs.readFileSync('.secret').toString().trim();
const ABIContract = require('./abicontract.json');
const CONTRACT_ADDRESS = '0x707560dC874F9B0331Dc4A72d150D93298bB4Cac';
const QUICKNODERPC =
  'https://red-multi-valley.matic-testnet.discover.quiknode.pro/61b21728fa928158390362bfe247eab7ee8c68e7/';

  const web3 = new Web3(new Web3.providers.HttpProvider(QUICKNODERPC));
  const contract = new web3.eth.Contract(ABIContract, CONTRACT_ADDRESS);

  app.post('/setVerified', async (req, res) => {

    try {

        const { id, flag } = req.body;
        console.log(id);
        console.log(flag);

        const txObject = {
            from: web3.eth.accounts.privateKeyToAccount(privateKey).address,
            to: CONTRACT_ADDRESS,
            gasLimit: web3.utils.toHex(8000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'gwei')),
            data: contract.methods.setVerified(0, parseInt(id), flag).encodeABI(),
            gasProvider: new Web3.providers.HttpProvider(QUICKNODERPC)


        };


        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        res.json({ status: 'success', receipt: txReceipt });



    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  

  });

  app.listen(PORT, (err) => {
    err ? console.error(err) : console.log(`listening on port ${PORT}`);
  });






