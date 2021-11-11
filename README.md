# Crowd Contract

개발환경

- Visual Studio Code
- truffle
- ganache
- yarn

네트워크
- 이더리움
- 바이낸스 스마트 체인



## truffle

> truffle create migration CROWDToken


컴파일 사이즈 확인
> grep \"bytecode\" build/contracts/* | awk '{print $1 " " length($3)/2}'
## TOKEN

- CWD Token
- mintable, burnable
## BRIDGE

- etheruem to bsc(Binance Smart Chain) for CWD token
- bsc to ethereum for CWD token
- user confirm
- can not cancel

### step

1. CWD transfer to Bridge on Ethereum Network
1. after 6 confirmations
1. confirm on BSC Network => receive CWD Token 
1. 
## Ticket


## Staking

## POOL


## Wallet
