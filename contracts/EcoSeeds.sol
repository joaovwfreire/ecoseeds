// SPDX-License-Identifier: BlueOak-1.0.0
pragma solidity ^0.8.19;

contract EcoSeeds is ERC20, ERC20Detailed, Ownable {

    struct Sale {
        address owner;
        boolean acceptsNct;
        uint256 pricePerUnitInNativeToken;
        uint256 lockInPeriod;
        uint256 maxAmount;
        uint256 sold;
    }


    mapping(address => Sale) public Sales;
    address public nct;
    address public nctOracle;

    constructor () public ERC20Detailed("EcoSeeds", "ECO", 18) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function createSale(address existingToken, uint256 _pricePerUnitInNativeToken, uint256 _lockInPeriod, uint256 _limit, boolean _acceptsNct) external{}

    function finishSale(address token) external {}

    function buyTokens(address token, uint256 amount) external {}

    function withdrawTokens(address token, uint256 amount) external {}

    function burn(address token, uint256 amount) external {}

    function claim(address token) external {}

    function adminWithdraw(address token, uint256 amount) external {}

    function setOracle(address oracle) external {}

    function setNct(address token) external {}


}