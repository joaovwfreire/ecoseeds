![Overview](https://bafkreienwsme7rvaqt7nwa2bura4wt3aepcjayp5qc3xkcelyxf3wyia6y.ipfs.w3s.link/)

## Token flow 
1. Deploy token contract
2. Approve unlimited minting to the sales contract
3. Create sale
    a. Mint tokens to the sales contract
    b. Sale configuration
4. Buy tokens
    a. Increase user balance at the sales contract
    b. Setup superfluid token earnings stream
5. Withdraw tokens
    a. Check if lock period is over
    b. Decrease user balance at the sales contract according to the earnings stream
    c. Send tokens to user

## Tasks 
- [x] Create a repo	
- [x] Create a README.md
- [x] Create a .gitignore
- [x] Create a LICENSE
- [ ]  Fix the overview diagram