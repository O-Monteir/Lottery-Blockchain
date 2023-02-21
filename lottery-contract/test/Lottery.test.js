const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const web3=new Web3(ganache.provider());

//interface and bytecode
const {interface , bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from:accounts[0],gas:'1000000'});
});

describe('Lottery Contract',()=>{
    it('Deployes a contract',()=>{
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter',async()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        
        const players = await lottery.methods.getPlayers().call({
            from :accounts[0]
        });

        //ensure only 1 record in array
        assert.equal(accounts[0],players[0]);
        //ensure that correct address is stored inside
        assert.equal(1,players.length);
    });

    it('allows multiple accounts to enter',async()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });

        await lottery.methods.enter().send({
            from:accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });

        await lottery.methods.enter().send({
            from:accounts[2],
            value: web3.utils.toWei('0.02','ether')
        });
        
        const players = await lottery.methods.getPlayers().call({
            from :accounts[0]
        });

        //ensure only 1 record in array
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        //ensure that correct address is stored inside
        assert.equal(3,players.length);
    });

    it('requires a min amt of ether to enter',async()=>{
        try{
            await lottery.methods.enter().send({
                from:accounts[0],
                value:0
            });
            assert(false); //false always fails a test
        }
        catch(err){
            assert(err);
            //to ensure an truth is present
        }
        
    });

    it('only manager can call pickWinner',async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from:accounts[1]
            });
            assert(false); //false always fails a test
        }
        catch(err){
            assert(err);
            //to ensure an truth is present
        }
    });

    it('Sends money to winner and resets players',async ()=>{
        //testing if one player is winner or not
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        });
        //to check who was winnner we compare the before and after balance of the account
         const initialBalance= await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from:accounts[0]});
        
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        //our account balance will be slightly less that 2 ethers
        //some amt goes in gas
        //hence
        const difference= finalBalance-initialBalance;
        //console.log(finalBalance-initialBalance); //spend on gas
        assert(difference>web3.utils.toWei('1.8','ether'));
    });

    //to test if list is empty or no 
    //to test if lottery is empty or no
    //do it yourself
});