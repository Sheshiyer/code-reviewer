# Contributing Guide 🤝

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

We expect all contributors to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

## 🚀 Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/code-reviewer.git
   cd code-reviewer
   npm install
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

## 💻 Development Process

1. **Pick an Issue**
   - Check open issues or create a new one
   - Comment on the issue you'd like to work on
   - Wait for assignment or approval

2. **Development**
   - Write clean, maintainable code
   - Follow TypeScript best practices
   - Add tests for new features
   - Update documentation as needed

3. **Testing**
   - Run the test suite
   - Add new tests for your changes
   - Ensure all tests pass

## 🔄 Pull Request Guidelines

### PR Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] PR description explains changes
- [ ] Linked to relevant issues

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add Python language support
^--^  ^--------------------^
|     |
|     +-> Summary in present tense
|
+-------> Type: feat, fix, docs, style, refactor, test, or chore
```

## 📝 Coding Standards

### TypeScript Guidelines
- Use strict mode
- Prefer interfaces over types
- Document public APIs
- Follow SOLID principles

### Style Guide
```typescript
// Use interfaces for object definitions
interface ExpertResult {
  suggestions: Suggestion[];
  confidence: number;
}

// Use async/await
async function analyzeCode(input: string): Promise<Result> {
  const context = await buildContext(input);
  return processContext(context);
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test test/analyze-code.js

# Run with coverage
npm run test:coverage
```

### Writing Tests
```typescript
describe('ExpertSystem', () => {
  it('should analyze JavaScript code correctly', async () => {
    const input = 'const x = 5;';
    const result = await expert.analyze(input);
    expect(result.suggestions).toHaveLength(1);
  });
});
```

## 📚 Documentation

- Update README.md for significant changes
- Document new features in IMPLEMENTATION.md
- Update API documentation
- Add JSDoc comments for new functions

---

Thank you for contributing to Code Reviewer! 🎉
