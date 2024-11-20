# The Looma Project Interview

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). This project is part of an interview for The Looma Project.

# DataTester Component

The `DataTester` component is a React component that allows users to input a user ID and fetch mock data from an API. It includes form validation, error handling, and displays the fetched data in a formatted manner. 

## Usage

To use the `DataTester` component, simply import it and include it in your JSX:

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Part 2: Strategic Planning Answers


### 2a) Scaling, Extensibility, and Performance:
To handle a massive increase in users and easily add new data sources, I would redesign the API to be modular, breaking it into smaller, independent services. This makes it easier to update parts without affecting the whole system. I'd implement caching to store frequently accessed data, so the API doesn't have to fetch it every time, improving speed. Using scalable technologies that can automatically adjust to traffic loads ensures the API remains fast and reliable as more people use it.

### 2b) Reliability and Observability:
To make the API highly reliable and easy to monitor, I'd set up tools that continuously check its health and performance, alerting us immediately if something goes wrong. Detailed logging would help us track down issues quickly. Designing the API to handle failures gracefully means that if one part fails, it doesn't crash the whole system—instead, it might use backups or show friendly error messages. This approach keeps the API running smoothly and users happy, even when problems occur.

If you have any questions, email me at moe.chowdhury@outlook.com
