# Planning Document - 2023-05-23

These are my notes for the epicenter project.

Our prototype is [Deployed on Vercel](https://t3.epi.phac.v.imetrical.com/)

*From Chris' README:*

> This app is a learning project and attempt to create a data-centric model and Graphql API of employee skills, capabilities, certifications and work over time.

- [ ] Model people and their roles on teams
- [ ] Model people's skills and validate them based on their work
- [ ] Model how teams fit into an org hierarchy
- [ ] Model organizational capacity and work in progress
- [ ] Time-series modelling of changes to the organization over time as people change roles, learn and evolve.

It also includes :

- [x] User models
- [x] Automated Admin Generation
- [x] Authentication and sign-in

## Current Prototype

We have moved quickly to investigate alternative stacks.
This is our progress so far

- We have implemented a monorepo (turbo) - which gives us orchestration and operational caching
- We have an initial CI (GitHub Actions)
- We have an initial CD (Vercel) - with preview-deployments
  - Serverless Database (with forks) - Neon
- ORM model (Prisma) - synchronized on Chris' unmodified schema

## History

Chris has been experimenting since at least Feb 2023.
His [repo](https://github.com/ToferC/epi_center) is written in rust.
It uses the `actix` framework, and `diesel for the orm`

He has a burgeoning [frontend](https://github.com/ToferC/epifront) repo for the frontend.
It uses
It is a static site authored in rust. The javascript is using `jquery, jquery-ui, and bootstrap`

## Tech Stack

| Component         | Current  | Planned or Alternatives           |
|-------------------|----------|-----------------------------------|
| Frontend          | React    |                                   |
| Framework         | Next.js  |                                   |
| Monorepo          | Turbo    | Nx (nrwl)                         |
| ORM               | Prisma   |                                   |
| RPC               | tRPC     | GraphQL                           |
| Styling           | Tailwind |                                   |
| Testing           |          | Jest/Storybook/Cypress/Playwright |
| Deployment        | Vercel   | GCP Cloud Run                     |
| Database (deploy) | Neon     | AlloyDB, CloudSQL Postgres        |
| Observability     |          |                                   |

## References

- [Dan's monorepo](https://github.com/daneroo/phac-epi-garden)
  - [Deployed at Vercel](https://t3.epi.phac.v.imetrical.com/)
- [tRPC](https://trpc.io/)
- [Chris' Rust based repo (GraphQL endpoint)](https://github.com/ToferC/epi_center)
- [Chris' frontend](https://github.com/ToferC/epifront)
