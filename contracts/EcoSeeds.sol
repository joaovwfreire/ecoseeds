// SPDX-License-Identifier: BlueOak-1.0.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./token/MintableERC20.sol";
contract EcoSeeds is Ownable {

    using SafeMath for uint256;

    struct Sale {
        address owner;
        bool acceptsNct;
        uint256 pricePerUnitInNativeToken;
        uint256 lockInEnd;
        uint256 maxAmount;
        uint256 sold;
    }

    address public nct;
    address public nctOracle;
    address public superTokenFactory;

    // token => user => amount
    mapping(address => mapping(address => uint256)) public balances;
    mapping(address => Sale) public Sales;

    event SaleCreated(address indexed owner, uint256 pricePerUnitInNativeToken, uint256 lockInEnd, uint256 limit, bool acceptsNct, address token);
    event SaleFinished(address indexed token, address indexed owner);
    event Purchase(address indexed token, address indexed buyer, uint256 amount);
    event Withdraw(address indexed token, address indexed buyer, uint256 amount);

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

// add reentrancy guard here
    function buyTokens(address token) external payable returns(bool) {
        require(Sales[token].sold < Sales[token].maxAmount + 1, "Sale is finished");

        uint256 amountToAdd = msg.value.div(Sales[token].pricePerUnitInNativeToken);
        require(Sales[token].sold + amountToAdd <= Sales[token].maxAmount, "Not enough tokens left");
        
        balances[token][msg.sender] += amountToAdd;
        Sales[token].sold += amountToAdd;

        emit Purchase(token, msg.sender, amountToAdd);

    }

    function withdrawTokens(IERC20 token, uint256 amount) external {

        require(balances[address(token)][msg.sender] >= amount, "Not enough tokens to withdraw");
        require(Sales[address(token)].lockInEnd < block.timestamp, "Lock period not over yet");
        
        balances[address(token)][msg.sender] -= amount;
        IERC20(token).transfer(msg.sender, amount);

        emit Withdraw(address(token), msg.sender, amount);
    }

    function burn(address token, uint256 amount) external {

        require(Sales[token].owner == msg.sender, "Only owner can burn tokens");
    }

    function claim(address token) external {

        require(Sales[token].lockInEnd > block.timestamp, "Lock period not over yet");
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