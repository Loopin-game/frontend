# Frontend deploy (Vercel / Netlify)

Set these in your host’s environment UI:

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE` | WebServer URL + `/api`, e.g. `https://loopin-server.azurewebsites.net/api` |
| `VITE_WS_URL` | WebSocket origin, e.g. `wss://loopin-server.azurewebsites.net` |
| `VITE_SOLANA_NETWORK` | `mainnet-beta` for Bags |
| `VITE_SOLANA_RPC_URL` | Optional; defaults to public cluster RPC |
| `VITE_BAGS_API_KEY` | From [dev.bags.fm](https://dev.bags.fm/) — enables lifetime fees / pool in dashboard |
| `VITE_LOOPIN_TOKEN_MINT` | Your Bags token mint |

Copy from [.env.example](./.env.example) and fill values.
