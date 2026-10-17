# Security

This repository holds examples and configuration only; it deploys nothing to
mainnet. To report a vulnerability in RWA Chain or in this kit, email
security@rwa.inc instead of opening a public issue.

Never commit a private key. The CI's testnet deploy job reads its key from the
`DEPLOYER_KEY` Actions secret, which holds a testnet-only wallet.
