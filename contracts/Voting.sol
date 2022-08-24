pragma solidity 0.8.15; 
pragma experimental ABIEncoderV2;                               // I import it in order to be able to return an array of structs from the result function

contract Voting {
    mapping (address=>bool) public voters;                      // mapping of approved voter addresses 
    struct Choice {                                             //a struct ,representing a choice for every ballot
        uint id;
        string name;
        uint votes;
    }
   
    struct Ballot {                                             //the struct for the ballot
        uint id;
        string name;
        Choice[]  choices;
        uint end;
    }

    mapping (uint => Ballot) public ballots;                           // a mapping of ballots
    uint nextBallotId;
    address public admin;

    mapping(address=>mapping(uint=>bool)) voterVotes;          // a nested mapping that stores all the ballots for which an address has voted

    constructor() {
        admin = msg.sender;
    }
   

    modifier onlyAdmin () {
        require(msg.sender == admin, "Only an admin can execute this fn");
        _;
    }
    function addVoters (address[] calldata _voters) external onlyAdmin{     // every address passed in the argument array will get its bool from the voters mapping to true;
        for (uint i=0; i<_voters.length; i++){
            voters[_voters[i]]=true;
        }

    }

    function createBallot(string memory _name, string[] memory _choices, uint _offset) public onlyAdmin {
        ballots[nextBallotId].id = nextBallotId;
        ballots[nextBallotId].name = _name;
        ballots[nextBallotId].end = block.timestamp +_offset;
        for (uint i=0;i<_choices.length; i ++){                                             //I am looping through every item in the _choices array that I pass as an argument to this function which then I create a struct array which i then push to the Choice array whihch is in the ballot struct)
            ballots[nextBallotId].choices.push (Choice(i,_choices[i],0));
        }
        
    }

    function vote (uint ballotId, uint choiceId) external {
        require(voters[msg.sender]==true,"You are not approoved to vote");
        require(voterVotes[msg.sender][ballotId]==false,"You have already voted for this ballot");
        require(ballots[ballotId].end>=block.timestamp, "Vote for this ballot has ended");
        ballots[ballotId].choices[choiceId].votes++;                                        //increment the number of votes for the particular choice
        voterVotes[msg.sender][ballotId]=true;                                              // change the bool status for this specific voter for this vote
    }

    function result (uint ballotId) public view returns(Choice[] memory) {
    require(ballots[ballotId].end<block.timestamp, "Vote for this ballot has not ended");
    return ballots[ballotId].choices;

    }

}