//version of solidity
pragma solidity ^0.4.17;

contract Lottery{
    address public manager; //writing a frontend javascript application
    
    address[] public players; //our players

    function Lottery() public {
        manager = msg.sender;
        //msg is a global variable
    } 

    function enter() public payable { //payable is a function, call function and send ether
        
        
        require(msg.value > .01 ether);//to access the money sent in the transaction
        players.push(msg.sender);
        //pushing a record containing address of player into player array
        
    }
    function random() public view returns (uint){
        return uint( keccak256(block.difficulty, now,players));//global variable, calling algorithm
        //now  is for current time
        //players is array of players
        //uint gives unsigned int
    }

    function pickWinner() public restricted{
        
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        //we get an address
        //applyign transfer property to address inside index
        //all the balance present in the contract
        players = new address[](0); //initialize size of zero but its adynamic array
    }

    //function modifier

    modifier restricted(){
        require(msg.sender==manager);
        _; 
        //if this restricted is added to a function, our compiler picsks up the code from the function 
        //and adds it to this underscore
    }

    //ensures we don't duplicate code

    function getPlayers() public view returns(address[]){
        return players;
    }
    //public means everyone can access
    //its view only,code cannot be rewritten
    //its return an array of addresses

}


