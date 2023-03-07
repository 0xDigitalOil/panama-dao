---
title: Where can I inspect the token and DAO contracts?
order: 4
---

<a href="https://goerli.etherscan.io/address/0x401f6857d39efb8e6eb9e68a37c7bfa291702c06">NFT</a><br>
<a href="https://goerli.etherscan.io/address/0x8dA731517B3a8531f7241359b0C243774Bc31B5d">Auction House</a><br>
<a href="https://goerli.etherscan.io/address/0x44687e9Cd023394Cc0f63Eecd68BB39f6F29B4f3">Governor</a><br>
<a href="https://goerli.etherscan.io/address/0x3319C0baCF2bDad41c3cD76D9dFAE8415ecFfD36">Treasury</a><br>
<a href="https://goerli.etherscan.io/address/0x2ECA57b13Eb78D0A817A65aFf7f5c1dC7c4A5b09">Metadata</a><br>
<br><br>

All contracts are upgradable proxies, meaning the DAO can transition the implementation to a new contract by passing a proposal (via vote) that executes such a transaction.

Even the Metadata contract is mutable, meaning the DAO even has the ability to upgrade the NFT images themselves (e.g. adding new traits).