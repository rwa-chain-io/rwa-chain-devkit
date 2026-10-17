// Checks networks.json against the live chains: each RPC answers with the
// listed chain id, and every listed contract (L2 and L1) has code.
//   node scripts/check-networks.mjs
import { readFileSync } from 'node:fs'

const networks = JSON.parse(readFileSync(new URL('../networks.json', import.meta.url)))

async function rpc(url, method, params = []) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  if (!res.ok) throw new Error(`${url} ${method}: HTTP ${res.status}`)
  const body = await res.json()
  if (body.error) throw new Error(`${url} ${method}: ${body.error.message}`)
  return body.result
}

let failures = 0
const check = (ok, msg) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`)
  if (!ok) failures++
}

async function checkChain(label, url, chainId, contracts) {
  check(Number(await rpc(url, 'eth_chainId')) === chainId, `${label} chain id ${chainId}`)
  for (const [name, address] of Object.entries(contracts)) {
    const code = await rpc(url, 'eth_getCode', [address, 'latest'])
    check(code !== '0x', `${label} ${name} ${address} has code`)
  }
}

for (const [key, n] of Object.entries(networks)) {
  try {
    await checkChain(key, n.rpc, n.chainId, n.contracts)
    await checkChain(`${key} L1 ${n.l1.name}`, n.l1.rpc, n.l1.chainId, n.l1.contracts)
  } catch (e) {
    check(false, `${key}: ${e.message}`)
  }
}

if (failures) {
  console.error(`${failures} check(s) failed`)
  process.exit(1)
}
