const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'result live enhance month strong urban weapon allow cry error afraid month',
  // remember to change this to your own phrase!
  'https://goerli.infura.io/v3/5177541a0900451b8cfb38aee6894936'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });
  console.log(interface);
  console.log('Contract deployed to', result.options.address);
  // provider.engine.stop();
  // gives us address of deployment

  // now to access the interface stored in variable interface
  // console.log(interface);
  
};
deploy();
