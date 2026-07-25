# Contributing to CraftYourTrip

First off, thank you for considering contributing to CraftYourTrip! It's people like you that make the open-source community such a great place to learn, inspire, and create.

## Where to Start?

1. Check the [Issues](https://github.com/yourusername/craftyourtrip/issues) page to see if someone has already reported the bug or requested the feature.
2. If the issue doesn't exist, create a new one using our Issue Templates.
3. Fork the repository and create a branch for your feature or bug fix.

## Development Setup

Please refer to the `README.md` for instructions on how to set up the frontend and backend locally. 

### Guidelines
- **Frontend**: We use React 19 and Tailwind CSS. Ensure any new UI components match the existing premium design language (vibrant colors, micro-animations, accessible contrast). Keep components small and decoupled.
- **Backend**: We use Express.js and Zod. Any changes to the AI output expectations must be paired with an update to the Zod schema in `backend/validators/itinerarySchema.js`.

## Pull Request Process

1. Ensure your code passes all local linting and tests (if configured).
2. Update the README.md with details of changes to the interface, if applicable.
3. Your PR should describe *what* you changed and *why*.
4. Once you submit a PR, the maintainers will review it. Be open to feedback!

## Code Style
- Use modern ES6+ syntax.
- Prefer functional components and React Hooks.
- Use meaningful variable names over comments where possible.
- Avoid mutating React state directly; always use the provided state setters or immutable data patterns (especially crucial for `@dnd-kit`).

Thank you for contributing!
