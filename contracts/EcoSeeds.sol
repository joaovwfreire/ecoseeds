// SPDX-License-Identifier: BlueOak-1.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoSeeds is ERC20, ERC20Detailed, Ownable {

    struct Sale {
        address owner;
        boolean acceptsNct;
        uint256 pricePerUnitInNativeToken;
        uint256 lockInEnd;
        uint256 maxAmount;
        uint256 sold;
    }


    mapping(address => Sale) public Sales;
    address public nct;
    address public nctOracle;

    constructor () public ERC20Detailed("EcoSeeds", "ECO", 18) {
        _mint(msg.sender, INITIAL_SUPPLY);
        _owner = msg.sender;
    }

    function createSale(address existingToken, uint256 _pricePerUnitInNativeToken, uint256 _lockInEnd, uint256 _limit, boolean _acceptsNct) external{
        require(Sales[existingToken].owner == address(0), "Sale already exists");
        require(_pricePerUnitInNativeToken > 0, "Price must be greater than 0");
        require(_lockInEnd > 0, "Lock in period must be greater than 0");
        require(_limit > 0, "Limit must be greater than 0");

        if (existingToken != address(0)){
            Sales[existingToken] = Sale(msg.sender, _acceptsNct, _pricePerUnitInNativeToken, _lockInEnd, _limit, 0);
        } else {
            // Deploy new token

            // 
            Sales[newToken] = Sale(msg.sender, _acceptsNct, _pricePerUnitInNativeToken, _lockInEnd, _limit, 0);
        }
    }

    function finishSale(address token) external {
        require(Sales[token].owner == msg.sender, "Only owner can finish sale");
        Sales[token].sold = Sales[token].maxAmount + 1;
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

        require(owner == msg.sender, "Only owner can withdraw");
    }

    function setOracle(address oracle) external {

        require(owner == msg.sender, "Only owner can set oracle");
    }

    function setNct(address token) external {

        require(owner == msg.sender, "Only owner can set NCT");
    }

    function deployNewToken() internal {}


}