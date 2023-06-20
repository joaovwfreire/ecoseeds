import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-truffle5";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-deploy";
import "@nomiclabs/hardhat-etherscan";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
      chainId: 44787
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
      chainId: 42220
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
      chainId: 80001
    }
  },
  namedAccounts: {
    account0: 0
  },
  etherscan: {
    apiKey: {
        alfajores: process.env.ETHERSCAN_API_KEY as string,
        celo: process.env.ETHERSCAN_API_KEY as string,
        mumbai: process.env.POLYGONSCAN_API_KEY as string
      },
  },
  solidity: {
    compilers: [
        {
            version: "0.8.19",
            settings: {
              viaIR: true,
              metadata: {
                appendCBOR: false,
                bytecodeHash: "none"
              },
              optimizer: {
                enabled: true,
                runs: 1,
              }
            }
          }
    ]
  }

};

export default config;
0x6080346100cd57601f61205b38819003918201601f19168301916001600160401b038311848410176100d25780849260409485528339810103126100cd57610052602061004b836100e8565b92016100e8565b60008054336001600160a01b0319808316821784556040519590946001600160a01b03949093859391908416907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a3600560045560006005551683600154161760015516906002541617600255611f5e90816100fd8239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036100cd5756fe608060408181526004803610156200001657600080fd5b600092833560e01c90816306b091f91462000e40575080632c9f66391462000e155780635a7a609c1462000d8e57806369fe0e2d1462000cf85780636ae65bfa1462000ccd578063715018a61462000c7d57806375cbd0b414620008f85780637adbf97314620008485780638da5cb5b146200081e5780639ab891ba146200067e5780639d3d2d0c146200065d578063a78e548e14620005b0578063c23f001f1462000557578063ddca3f431462000538578063e66feebf146200047b578063ec8ac4d814620002cb578063ee63c53f146200029c578063f18d20be14620001c35763f2fde38b146200010857600080fd5b34620001bf576020366003190112620001bf576200012562000fa7565b906200013062000ff3565b6001600160a01b039182169283156200016d57505082546001600160a01b03198116831784551660008051602062001f1e8339815191528380a380f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b5034620001bf5782600319360112620001bf5782546001600160a01b0316330362000260576005549081156200022757508280808062000206943382f16200110c565b81600555518181528160008051602062001f3e83398151915260203393a380f35b606490602084519162461bcd60e51b835282015260136024820152724e6f206665657320746f20776974686472617760681b6044820152fd5b6020606492519162461bcd60e51b835282015260176024820152764f6e6c79206f776e65722063616e20776974686472617760481b6044820152fd5b505034620002c75781600319360112620002c75760015490516001600160a01b039091168152602090f35b5080fd5b50919060209283600319360112620001bf576001600160a01b03620002ef62000fa7565b1680845260078552600160ff8486205460a81c161515036200044657808452600785526001838520015480156200043357340491818552600786526200033b83828688200154620010a0565b828652600787526003858720015410620003f7578185526006865283852033865286528385206200036e848254620010a0565b905581855260078652808486200162000389848254620010a0565b9055805490813402913483041434151715620003e457506064620003b19104600554620010a0565b60055582519182527f22e3ae3a20c49dce14046235895c7a3ffc0a6a5f3577c370177ad45fa619485d853393a351908152f35b634e487b7160e01b865260119052602485fd5b835162461bcd60e51b81529081018690526016602482015275139bdd08195b9bdd59da081d1bdad95b9cc81b19599d60521b6044820152606490fd5b634e487b7160e01b855260128352602485fd5b5083606492519162461bcd60e51b8352820152601060248201526f14d85b19481a5cc8199a5b9a5cda195960821b6044820152fd5b509034620001bf576020366003190112620001bf576001600160a01b039182620004a462000fa7565b1692838552600760205282852054163303620004f9575081835260076020528220805460ff60a81b1916905533907f8ab98e39a514a4d611b6876f43441787aeb5904def836e1471adaa7d112530248380a380f35b6020606492519162461bcd60e51b8352820152601a6024820152794f6e6c79206f776e65722063616e2066696e6973682073616c6560301b6044820152fd5b5034620001bf5782600319360112620001bf5760209250549051908152f35b505034620002c75780600319360112620002c7576200057562000fa7565b6001600160a01b036024358181169290839003620005ac579160209491849316825260068552828220908252845220549051908152f35b8480fd5b5034620001bf576020366003190112620001bf57620005ce62000fa7565b83546001600160a01b0393919291908416330362000621575050168060018060a01b031960015416176001557f46a75142fb0b027089fb2aeb4c6a904d6a9ce4a3ed23706f7bd90bd6fbd490328280a280f35b906020606492519162461bcd60e51b8352820152601660248201527513db9b1e481bdddb995c8818d85b881cd95d081390d560521b6044820152fd5b505034620002c75781600319360112620002c7576020906005549051908152f35b5034620001bf576020806003193601126200081a576001600160a01b039182620006a762000fa7565b16928386526007835260ff8587205460a81c16620007e3578386526007835284862054163303620007a25782855260078252620006ec600285872001544211620010c4565b8054908160640391606483116200078f5784875260078452858720600183820154910154908181029181830414901517156200077c5780840293840414906064141715620003e4575090606460008051602062001f3e833981519152920493848680821562000772575b8180620007689481933390f16200110c565b519384523393a380f35b506108fc62000756565b634e487b7160e01b885260118352602488fd5b634e487b7160e01b875260118252602487fd5b60649184519162461bcd60e51b8352820152601d60248201527f4f6e6c79206f776e65722063616e20636c61696d206561726e696e67730000006044820152fd5b5060649184519162461bcd60e51b8352820152601260248201527153616c65207374696c6c206f6e676f696e6760701b6044820152fd5b8380fd5b505034620002c75781600319360112620002c757905490516001600160a01b039091168152602090f35b5034620001bf576020366003190112620001bf576200086662000fa7565b83546001600160a01b03939192919084163303620008b9575050168060018060a01b031960025416176002557f0e05ae75e8b926552cf6fcd744d19f422561e3ced1e426868730852702dbe4188280a280f35b906020606492519162461bcd60e51b835282015260196024820152784f6e6c79206f776e65722063616e20736574206f7261636c6560381b6044820152fd5b509034620001bf5760c0366003190112620001bf57813591602491823590604435916064359384151580950362000c79576001600160401b039560843587811162000c75576200094c903690840162000fc3565b929060a43589811162000c715762000968903690840162000fc3565b8b9591951562000c3057861562000be057881562000b9f57875192610db180850193908d85118686101762000b8c57859493620009bd6012948d94620009ce946200116d8a396060885260608801916200114b565b9060209a8683038c8801526200114b565b92015203908bf0801562000b825760018060a01b03809116988b858b868b8b51948593849263140e25ad60e31b84528a8401525af1801562000b785762000b44575b50898c526007855281878d20541662000b0c5786519360e085019182118583101762000afb57508b8b8b938a938a52338752878701908c82528a88019060018252606089019384528b60808a01958c875260a08b0197885260c08b0198818a52815260078c522098511688549260ff60a01b9051151560a01b169160ff60a81b9051151560a81b169260018060b01b0319161717178655516001860155516002850155516003840155519101558251968752860152840152606083015260808201527f4ccd719ee246ca8eb561bd08d8501dfe12b525d442e23a67b0ed4a3566facb3560a03392a280f35b634e487b7160e01b8d52604184528cfd5b865162461bcd60e51b81528084018690526013818601527253616c6520616c72656164792065786973747360681b6044820152606490fd5b62000b6890863d881162000b70575b62000b5f81836200104c565b81019062001086565b503862000a10565b503d62000b53565b88513d8f823e3d90fd5b85513d8c823e3d90fd5b50634e487b7160e01b8f5260418652868ffd5b875162461bcd60e51b8152602081860152601c818701527b04c696d6974206d7573742062652067726561746572207468616e20360241b6044820152606490fd5b875162461bcd60e51b81526020818601526025818701527f4c6f636b20696e20706572696f64206d75737420626520677265617465722074604482015264068616e20360dc1b6064820152608490fd5b875162461bcd60e51b8152602081860152601c818701527b05072696365206d7573742062652067726561746572207468616e20360241b6044820152606490fd5b8b80fd5b8980fd5b8780fd5b833462000cca578060031936011262000cca5762000c9a62000ff3565b80546001600160a01b03198116825581906001600160a01b031660008051602062001f1e8339815191528280a380f35b80fd5b505034620002c75781600319360112620002c75760035490516001600160a01b039091168152602090f35b509034620001bf576020366003190112620001bf578254823592906001600160a01b0316330362000d535791602091817f6bbc57480a46553fa4d156ce702beef5f3ad66303b0ed1a5d4cb44966c6584c3945551908152a180f35b6020606492519162461bcd60e51b835282015260166024820152754f6e6c79206f776e65722063616e207365742066656560501b6044820152fd5b50919034620002c7576020366003190112620002c75760e0926001600160a01b039282908462000dbd62000fa7565b1681526007602052209081549260018301549060ff60028501549360038601549501549582519781168852818160a01c161515602089015260a81c161515908601526060850152608084015260a083015260c0820152f35b505034620002c75781600319360112620002c75760025490516001600160a01b039091168152602090f35b84939150346200081a57816003193601126200081a5782356001600160a01b0381169190829003620005ac576024359282865260209160068352818720338852835284828820541062000f6657508286526007825262000ea8600282882001544211620010c4565b82865260068252808620338752825280862080549085820391821162000f53575580519463a9059cbb60e01b86523390860152836024860152818560448189875af194851562000f49577f9b1bfa7fa9ee420a16e124f794c35ac9f90472acc99140eb2f6447c714cad8eb93949562000f27575b50519384523393a380f35b62000f4190833d851162000b705762000b5f81836200104c565b508662000f1c565b81513d88823e3d90fd5b634e487b7160e01b885260118752602488fd5b62461bcd60e51b8152858101839052601d60248201527f4e6f7420656e6f75676820746f6b656e7320746f2077697468647261770000006044820152606490fd5b600435906001600160a01b038216820362000fbe57565b600080fd5b9181601f8401121562000fbe578235916001600160401b03831162000fbe576020838186019501011162000fbe57565b6000546001600160a01b031633036200100857565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b601f909101601f19168101906001600160401b038211908210176200107057604052565b634e487b7160e01b600052604160045260246000fd5b9081602091031262000fbe5751801515810362000fbe5790565b91908201809211620010ae57565b634e487b7160e01b600052601160045260246000fd5b15620010cc57565b60405162461bcd60e51b8152602060048201526018602482015277131bd8dac81c195c9a5bd9081b9bdd081bdd995c881e595d60421b6044820152606490fd5b156200111457565b60405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b6044820152606490fd5b908060209392818452848401376000828201840152601f01601f191601019056fe6080604052346200033b5762000db1803803806200001d8162000340565b92833981016060828203126200033b5781516001600160401b03908181116200033b57826200004e91850162000366565b90602092838501518281116200033b576040916200006e91870162000366565b9401519360ff85168095036200033b5782518281116200023b576003918254916001958684811c9416801562000330575b888510146200031a578190601f94858111620002c4575b5088908583116001146200025d5760009262000251575b505060001982861b1c191690861b1783555b80519384116200023b5760049586548681811c9116801562000230575b828210146200021b57838111620001d0575b508092851160011462000162575093839491849260009562000156575b50501b92600019911b1c19161790555b60ff1960055416176005556040516109d89081620003d98239f35b0151935038806200012b565b92919084601f1981168860005285600020956000905b89838310620001b557505050106200019a575b50505050811b0190556200013b565b01519060f884600019921b161c19169055388080806200018b565b85870151895590970196948501948893509081019062000178565b87600052816000208480880160051c82019284891062000211575b0160051c019087905b828110620002045750506200010e565b60008155018790620001f4565b92508192620001eb565b602288634e487b7160e01b6000525260246000fd5b90607f1690620000fc565b634e487b7160e01b600052604160045260246000fd5b015190503880620000cd565b90889350601f19831691876000528a6000209260005b8c828210620002ad575050841162000294575b505050811b018355620000df565b015160001983881b60f8161c1916905538808062000286565b8385015186558c9790950194938401930162000273565b90915085600052886000208580850160051c8201928b861062000310575b918a91869594930160051c01915b82811062000300575050620000b6565b600081558594508a9101620002f0565b92508192620002e2565b634e487b7160e01b600052602260045260246000fd5b93607f16936200009f565b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200023b57604052565b919080601f840112156200033b5782516001600160401b0381116200023b576020906200039c601f8201601f1916830162000340565b928184528282870101116200033b5760005b818110620003c457508260009394955001015290565b8581018301518482018401528201620003ae56fe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde031461060257508163095ea7b3146105d857816318160ddd146105b957816323b872dd146104ef578163313ce567146104cd578163395093511461047d57816370a082311461044657816395d89b4114610345578163a0712d681461020e578163a457c2d71461016657508063a9059cbb14610136578063aec6e724146100ff5763dd62ed3e146100b457600080fd5b346100fb57806003193601126100fb57806020926100d0610705565b6100d8610720565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b50346100fb5760203660031901126100fb5760209181906001600160a01b03610126610705565b1681526006845220549051908152f35b50346100fb57806003193601126100fb5760209061015f610155610705565b6024359033610759565b5160018152f35b9050823461020b578260031936011261020b57610181610705565b918360243592338152600160205281812060018060a01b03861682526020522054908282106101ba5760208561015f85850387336108b5565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b905034610341576020928360031936011261020b578135913382526006855283822061023b848254610736565b9055338252600685528382205460ff60055416604d811161032e57600a0a90620f4240918083029283040361032e5710156102f75733156102b4575061028382600254610736565b60025533815280845282812082815401905582519182526000805160206109b8833981519152843393a35160018152f35b835162461bcd60e51b8152908101859052601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606490fd5b835162461bcd60e51b81529081018590526011602482015270195e18d95959081b5a5b9d081b1a5b5a5d607a1b6044820152606490fd5b634e487b7160e01b845260118352602484fd5b8280fd5b8383346100fb57816003193601126100fb57805190828454600181811c9080831692831561043c575b60209384841081146104295783885290811561040d57506001146103d5575b505050829003601f01601f19168201926001600160401b038411838510176103c257508291826103be9252826106bc565b0390f35b634e487b7160e01b815260418552602490fd5b919250868652828620918387935b8385106103f9575050505083010185808061038d565b8054888601830152930192849082016103e3565b60ff1916878501525050151560051b840101905085808061038d565b634e487b7160e01b895260228a52602489fd5b91607f169161036e565b5050346100fb5760203660031901126100fb5760209181906001600160a01b0361046e610705565b16815280845220549051908152f35b5050346100fb57806003193601126100fb5761015f6020926104c66104a0610705565b338352600186528483206001600160a01b03821684528652918490205460243590610736565b90336108b5565b5050346100fb57816003193601126100fb5760209060ff600554169051908152f35b839150346100fb5760603660031901126100fb5761050b610705565b610513610720565b91846044359460018060a01b03841681526001602052818120338252602052205490600019820361054d575b60208661015f878787610759565b848210610576575091839161056b6020969561015f950333836108b5565b91939481935061053f565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346100fb57816003193601126100fb576020906002549051908152f35b5050346100fb57806003193601126100fb5760209061015f6105f8610705565b60243590336108b5565b8490843461034157826003193601126103415782600354600181811c908083169283156106b2575b60209384841081146104295783885290811561040d575060011461067957505050829003601f01601f19168201926001600160401b038411838510176103c257508291826103be9252826106bc565b91925060038652828620918387935b83851061069e575050505083010185808061038d565b805488860183015293019284908201610688565b91607f169161062a565b6020808252825181830181905290939260005b8281106106f157505060409293506000838284010152601f8019910116010190565b8181018601518482016040015285016106cf565b600435906001600160a01b038216820361071b57565b600080fd5b602435906001600160a01b038216820361071b57565b9190820180921161074357565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b039081169182156108625716918215610811576000828152806020526040812054918083106107bd57604082826000805160206109b8833981519152958760209652828652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b0390811691821561096657169182156109165760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260018252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fdfeddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05203967c019649a5548c7c2c1358e5390674ff8255b8513913a15ce4c2a41bfe000000000000000000000000874069fa1eb16d44d622f2e0ca25eea172369bc1000000000000000000000000874069fa1eb16d44d622f2e0ca25eea172369bc1