# Sitemap Tester

Sitemap Tester is a Node.js application for validating sitemaps. It fetches the main sitemap of a given domain, parses it to find all page URLs, and then checks each page to ensure it is accessible.

## Features

- Fetches and parses sitemaps and nested sitemaps.
- Validates each URL in the sitemap.
- Reports inaccessible URLs and their HTTP status codes.

## Prerequisites

- Node.js 18+

## Installation

First, clone the repository to your local machine and navigate to the directory,
Then, install the dependencies using Yarn (NPM or whatever):

```bash
yarn install
```

## Usage

To start the application, run:

```bash
yarn start <domain>
```

Replace `<domain>` with the domain you want to test. For example:

```bash
yarn start example.com
```

The application will fetch the sitemap from the specified domain, parse it, and test each URL in the sitemap.

## Output

The application will output:

- A dot (`.`) for each successfully tested URL.
- An 'x' for each URL that fails the test.
- A summary of inaccessible URLs along with their HTTP status codes.
- The total count of URLs tested, inaccessible URLs, and successfully accessed URLs.

## License

[Your chosen license]
