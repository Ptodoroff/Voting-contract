
const Voting = artifacts.require('Voting.sol');
let voting;


contract("Voting", (accounts) =>{
    const admin = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const nonVoter = accounts[9];
    beforeEach(async () =>{
        voting = await Voting.deployed();
    })

    it('should add voters from the voters array',async()=>{
    await voting.addVoters([voter1,voter2,voter3],{from:accounts[0]});
    const result = [];
     result[1] = await voting.voters(voter1);
     result[2] = await voting.voters(voter2);
     result[3] = await voting.voters(voter3);

    result.forEach(result=>assert(result===true ,"all addreses are added as veligible voters"))
    })
})

