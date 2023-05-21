// SPDX-License-Identifier: BlueOak-1.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./token/MintableERC20.sol";
contract EcoSeeds is Ownable {

    struct Sale {
        address owner;
        bool acceptsNct;
        uint256 pricePerUnitInNativeToken;
        uint256 lockInEnd;
        uint256 maxAmount;
        uint256 sold;
    }


    mapping(address => Sale) public Sales;
    address public nct;
    address public nctOracle;
    address public superTokenFactory;

    event SaleCreated(address indexed owner, uint256 pricePerUnitInNativeToken, uint256 lockInEnd, uint256 limit, bool acceptsNct, address token);
    event SaleFinished(address indexed token, address indexed owner);
    
    constructor (address _nct, address _nctOracle) {

        nct = _nct;
        nctOracle = _nctOracle;

    }

    /// @dev Creates a new sale
    /// @param _pricePerUnitInNativeToken The price per unit of the token in the native token (Celo)
    function createSale(uint256 _pricePerUnitInNativeToken, uint256 _lockInEnd, uint256 _limit, bool _acceptsNct,  string calldata name, string calldata symbol) external{
        
        require(_pricePerUnitInNativeToken > 0, "Price must be greater than 0");
        require(_lockInEnd > 0, "Lock in period must be greater than 0");
        require(_limit > 0, "Limit must be greater than 0");

        // create new mock token
        address newToken = deployNewToken(name, symbol);

        MintableERC20 existingToken = MintableERC20(newToken);
        existingToken.mint(_limit);

        require(Sales[address(existingToken)].owner == address(0), "Sale already exists");

        Sales[address(existingToken)] = Sale(msg.sender, _acceptsNct, _pricePerUnitInNativeToken, _lockInEnd, _limit, 0);

        emit SaleCreated( msg.sender, _pricePerUnitInNativeToken, _lockInEnd, _limit, _acceptsNct, address(existingToken));
    

    }

    function finishSale(address token) external {
        require(Sales[token].owner == msg.sender, "Only owner can finish sale");
        Sales[token].sold = Sales[token].maxAmount + 1;

        emit SaleFinished(token, msg.sender);
    }

    function buyTokens(address token, uint256 amount) external {
        require(Sales[token].sold + amount <= Sales[token].maxAmount, "Not enough tokens left");
        require(Sales[token].sold < Sales[token].maxAmount + 1, "Sale is finished");

    }

    function withdrawTokens(IERC20 token, uint256 amount) external {

        require(token.balanceOf(msg.sender) >= amount, "Not enough tokens");
    }

    function burn(address token, uint256 amount) external {

        require(Sales[token].owner == msg.sender, "Only owner can burn tokens");
    }

    function claim(address token) external {

        require(Sales[token].lockInEnd > block.timestamp, "Lock in period not over yet");
    }

    function adminWithdraw(address token, uint256 amount) external {

        require(owner() == msg.sender, "Only owner can withdraw");
    }

    function setOracle(address oracle) external {

        require(owner() == msg.sender, "Only owner can set oracle");
    }

    function setNct(address token) external {

        require(owner() == msg.sender, "Only owner can set NCT");
    }

    function deployNewToken(string calldata name, string calldata symbol) internal returns(address) {
        MintableERC20 newToken = new MintableERC20(name, symbol, 18);
        return address(newToken);
    }

}