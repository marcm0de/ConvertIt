# Contributing to ConvertIt

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/marcusfequiere/ConvertIt.git
   cd ConvertIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/            # Next.js app router pages
├── components/     # React converter components
└── lib/
    ├── conversions/ # Conversion logic per category
    └── store.ts     # Zustand state management
```

## How to Contribute

### Adding Conversion Categories

1. Create a new conversion file in `src/lib/conversions/`
2. Create a matching component in `src/components/`
3. Add the tab entry in `src/app/page.tsx`
4. Update the store's `TabId` type if needed

### Adding Units to Existing Categories

Unit definitions live in `src/lib/conversions/units.ts`. Add entries to the appropriate category array with `id`, `label`, and `factor` (relative to the base unit).

### Bug Reports & Feature Requests

Open an issue with a clear description and steps to reproduce (for bugs).

### Pull Requests

1. Fork the repo and create a feature branch
2. Make your changes with clear commit messages
3. Ensure `npm run build` passes
4. Open a PR with a description of what changed and why

## Code Style

- TypeScript strict mode
- Functional components with hooks
- Zustand for state management
- Tailwind CSS for styling
- Framer Motion for animations

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
