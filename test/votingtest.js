
const {expectRevert} = require("@openzeppelin/test-helpers");
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

     
    it('should not allow non-admins to add voters',async()=>{
        
        await expectRevert( voting.addVoters([voter1,voter2,voter3],{from:accounts[1]}),"Only an admin can execute this fn")

    })

   it("should create a new ballot", async () =>{
    await voting.createBallot("Dummy", ["one,","two","three"],3,{from:accounts[0]});
    let result = await  voting.ballots(0);
    assert(result.name=="Dummy", "the ballot is successfully created")
   })

   it("should  not allow creation of ballots by entities,other than the admin", async () =>{
    await expectRevert(voting.createBallot("Dummy", ["one,","two","three"],3,{from:accounts[1]}),"Only an admin can execute this fn")
   })

   it("should allow only approved voters to vote", async () =>{
    await voting.createBallot("Dummy", ["one,","two","three"],3,{from:accounts[0]});
    await expectRevert(voting.vote(0,0,{from:nonVoter}),"You are not approoved to vote")

    })
   it("should allow only approved voters to vote", async () =>{
    await voting.createBallot("Dummy", ["one,","two","three"],3,{from:accounts[0]});
    await voting.vote(0,0,{from:voter1})
    await expectRevert( voting.vote(0,0,{from:voter1}),"You have already voted for this ballot")

    })

    it("should allow oting only once per ballot", async () =>{
    await voting.createBallot("Dummy", ["one,","two","three"],3,{from:accounts[0]});
    await voting.vote(0,0,{from:voter1})
    await expectRevert( voting.vote(0,0,{from:voter1}),"You have already voted for this ballot")

    })

    it("should allow only approved voters to vote", async () =>{
        await voting.createBallot("Dummy", ["one,","two","three"],3,{from:accounts[0]});
        await voting.vote(0,0,{from:voter1})
        await expectRevert( voting.vote(0,0,{from:voter1}),"You have already voted for this ballot")
    
    })
})

