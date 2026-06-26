# FinTrack Frontend

React + Vite frontend for the FinTrack personal finance tracker. Containerised with Docker and deployed on AWS EKS via GitOps.

## Stack
React · Vite · Tailwind CSS · Recharts · Axios · Docker · nginx

## Features
- Dashboard with income/expense summary and charts
- Transaction management with category filtering
- Receipt upload via S3 presigned URLs (direct browser-to-S3)
- JWT authentication

## Environment Variables
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL - baked at Docker build time |

## Local Development
```bash
npm install
VITE_API_URL=http://localhost:3001 npm run dev
```

## Related Repositories
| Repo | Description |
|---|---|
| [fintrack-infrastructure](https://github.com/qezman/fintrack-infrastructure) | Terraform - full infrastructure and deployment guide |
| [fintrack-backend](https://github.com/qezman/fintrack-backend) | Fastify + Prisma API |
| [fintrack-gitops](https://github.com/qezman/fintrack-gitops) | Kubernetes manifests |