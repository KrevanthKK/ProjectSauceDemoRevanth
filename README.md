# Playwright Test Automation Framework - Sauce Demo

A production-grade, enterprise-level **End-to-End (E2E) test automation framework** for validating e-commerce web applications using **Playwright with TypeScript**. This framework implements the **Page Object Model (POM)** design pattern with strict architectural constraints and industry best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

---

## 🎯 Overview

This framework automates comprehensive end-to-end testing workflows for the **Sauce Demo e-commerce application**, covering:

- ✅ **Authentication**: Login validation, error scenarios, session management
- ✅ **Product Management**: Browse, filter, sort products
- ✅ **Shopping Cart**: Add/remove items, quantity management
- ✅ **Checkout Flow**: Complete purchase journey with billing info
- ✅ **UI Validation**: Navigation, footer, product details, sidebar

### Key Features

- **Web-First Locators**: Resilient, semantic-based element selection
- **Smart Assertions**: Async assertions with built-in wait strategies
- **Data-Driven Testing**: JSON-based test data with Faker.js integration
- **Multi-Environment**: Demo, QA, and UAT environment support
- **Advanced Reporting**: Allure Reports + HTML Reports with screenshots/videos
- **CI/CD Ready**: Parallel execution, automatic retries, forbid-only checks
- **Type Safety**: Strict TypeScript with enforced interfaces

---

## 🛠️ Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| **Playwright** | ^1.59.1 | Browser automation & testing |
| **TypeScript** | Latest | Type-safe automation code |
| **Node.js** | Latest | Runtime environment |
| **Allure Reports** | ^3.7.1 | Advanced test reporting |
| **Faker.js** | ^10.4.0 | Dynamic test data generation |
| **dotenv** | ^17.4.2 | Environment configuration |
| **cross-env** | ^10.1.0 | Cross-platform environment variables |

---

## 📁 Project Structure

```
PlaywrightFrameWork/
├── tests/                          # Test specifications
│   ├── Authentication.spec.ts      # Login & auth tests
│   ├── ProductItem.spec.ts         # Product interaction tests
│   ├── CartPage.spec.ts            # Shopping cart tests
│   ├── CheckOutPage.spec.ts        # Checkout validation tests
│   ├── e2eCheckout.spec.ts         # Complete checkout journey
│   ├── SideBarValidation.spec.ts   # Sidebar navigation tests
│   ├── TestLogin.spec.ts           # Additional login tests
│   ├── fillInfoDetail.spec.ts      # Checkout form filling
│   └── global.setup.ts             # Global test setup hooks
│
├── pages/                          # Page Object Models
│   ├── LoginPage.ts                # Login page interactions
│   ├── ProductsPage.ts             # Products page & filtering
│   ├── CartPage.ts                 # Shopping cart operations
│   ├── CheckOutOverview.ts         # Order summary page
│   ├── CheckOutFillInfo.ts         # Billing information page
│   ├── CheckOutFinishPage.ts       # Order confirmation page
│   ├── SideBar.ts                  # Navigation sidebar
│   ├── FooterModule.ts             # Footer interactions
│   ├── ProductItemPage.ts          # Product detail page
│   └── ProductLogo.ts              # Base class for product pages
│
├── fixture/                        # Test fixtures & setup
│   ├── hooks-fixture.ts            # Page object dependency injection
│   └── pom-fixture.ts              # POM fixture setup
│
├── utils/                          # Utility functions
│   └── faker.ts                    # Test data generation helpers
│
├── test-data/                      # Test data files
│   └── testdata.json               # Parameterized test data
│
├── env-files/                      # Environment configuration
│   ├── .env.demo                   # Demo environment config
│   ├── .env.qa                     # QA environment config
│   └── .env.uat                    # UAT environment config
│
├── playwright-report/              # HTML test reports
├── allure-results/                 # Allure report data
├── snapshots/                      # Visual regression snapshots
├── test-results/                   # Test result artifacts
│
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── playwright-rules.txt            # Architectural guidelines
├── package.json                    # Dependencies & scripts
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PlaywrightFrameWork
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Verify installation**
   ```bash
   npx playwright --version
   ```

---

## ⚙️ Configuration

### Environment Setup

Create environment files in the `env-files/` directory:

#### `.env.demo`
```env
BASE_URL=https://www.saucedemo.com/
DEMO_USERNAME=standard_user
DEMO_PASSWORD=secret_sauce
```

#### `.env.qa`
```env
BASE_URL=https://qa.saucedemo.com/
QA_USERNAME=qa_user
QA_PASSWORD=qa_password
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:

```typescript
{
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'always' }],
    ['allure-playwright', { outputFolder: 'allure-results', cleanStats: true }]
  ]
}
```

---

## 🧪 Running Tests

### Basic Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (default) |
| `npm run test:demo` | Run tests against Demo environment |
| `npm run test:qa` | Run tests against QA environment |
| `npm run test:demo_cr_he` | Run tests in headed mode (visual) - Demo |
| `npm run test:qa_cr_he` | Run tests in headed mode (visual) - QA |
| `npm run test:cr_he` | Run tests in headed mode (Chromium) |

### Advanced Execution

```bash
# Run specific test file
npx playwright test tests/Authentication.spec.ts

# Run tests with specific tag
npx playwright test --grep @smoke

# Run tests excluding tag
npx playwright test --grep-invert @skip

# Debug mode
npx playwright test --debug

# Run with tracing enabled
npx playwright test --trace on
```

---

## 📊 Reporting

### Allure Reports

1. **Generate and clean results**
   ```bash
   npm run clean:allure
   ```

2. **Run tests with Allure reporting**
   ```bash
   npm run test:allure
   ```

3. **Generate Allure report**
   ```bash
   npm run generate:allure
   ```

4. **Serve Allure dashboard**
   ```bash
   npm run report:allure
   ```
   Opens `http://localhost:4050` with interactive dashboard

### HTML Reports

HTML reports are automatically generated in `playwright-report/` after test execution with:
- Screenshots on failure
- Video recordings
- Detailed step logs
- Browser console messages

---

## 🏗️ Architecture & Design Patterns

### Page Object Model (POM)

This framework strictly implements the **Page Object Model** pattern to ensure:
- ✅ Separation of concerns
- ✅ Maintainability and reusability
- ✅ Resilience to UI changes

#### Example: LoginPage.ts

```typescript
export default class LoginPage implements ILoginActions, ILoginNavigation {
  readonly page: Page;
  private readonly userNameInput: Locator;
  private readonly userPasswordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.locator('[data-test="username"]');
    this.userPasswordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async loginSauceDemo(userName: string, password: string): Promise<void> {
    await this.userNameInput.fill(userName);
    await this.userPasswordInput.fill(password);
    await this.loginButton.click();
  }
}
```

#### Key Principles

1. **Private Locators**: All locators are `private readonly`
2. **Public Methods**: Expose only business logic operations
3. **Type Safety**: Explicit return types for all methods
4. **Interface Contracts**: Define expected behaviors via interfaces

```typescript
interface ILoginActions {
  loginSauceDemo(userName: string, password: string): Promise<void>;
}

interface ILoginNavigation {
  openSauceDemo(): Promise<void>;
  openProductPage(): Promise<void>;
}
```

### Test Fixtures

Tests use dependency injection via fixtures:

```typescript
import { test, expect } from "../fixture/hooks-fixture"

test('Valid Login', async ({ loginPage, productsPage, page }) => {
  await loginPage.openSauceDemo();
  await loginPage.loginSauceDemo('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/.*inventory.html/);
});
```

---

## 🎯 Best Practices

### Locator Strategy

✅ **Priority 1**: Web-First Locators
```typescript
page.getByRole('button', { name: 'Add to cart' })
page.getByText(/Order #\d+/i)
page.getByTestId('product-item')
```

❌ **Avoid**: Fragile XPath selectors
```typescript
// DON'T DO THIS:
page.locator('/html/body/div[1]/div[2]/button')
```

### Assertions

✅ **Smart Assertions** (async, with auto-wait)
```typescript
await expect(locator).toBeVisible();
await expect(page).toHaveURL(/.*inventory/);
await expect(locator).toHaveText('Expected Text');
```

❌ **Avoid**: Hardcoded waits
```typescript
// DON'T DO THIS:
await page.waitForTimeout(5000);
```

### Test Isolation

- Each test runs in isolated browser context
- No shared state between tests
- Fresh session for authentication tests
- Clean data between parallel executions

### Data-Driven Testing

```typescript
test.describe("Valid Login Scenarios", () => {
  for (const user of data.validLoginUsers) {
    test(`Login as ${user.description}`, async ({ loginPage }) => {
      // Test implementation
    });
  }
});
```

### Tagging for CI/CD

```typescript
test('Valid Login', { tag: ['@smoke', '@regression', '@sanity'] }, async () => {
  // Test implementation
});

// Run: npx playwright test --grep @smoke
```

---

## 📝 Test Coverage

### Test Scenarios

| Module | Tests | Coverage |
|--------|-------|----------|
| **Authentication** | 5+ | Valid/Invalid login, error handling |
| **Products** | 6+ | Browse, filter, sort, add/remove items |
| **Shopping Cart** | 4+ | Add items, remove items, cart badge |
| **Checkout** | 5+ | Complete journey, billing info, order confirmation |
| **UI Validation** | 3+ | Sidebar, footer, product details |
| **Total** | 23+ | End-to-end coverage |

---

## 🔍 Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Inspector
```bash
npx playwright test --debug
# Use VS Code debugger with breakpoints
```

### Trace Viewer
```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Console Logs
Enable in playwright.config.ts:
```typescript
use: {
  launchOptions: {
    devtools: true
  }
}
```

---

## 🚢 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run test:qa
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Allure Reports](https://docs.qameta.io/allure)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/api-tests`
2. Follow architectural guidelines in `playwright-rules.txt`
3. Write tests with clear descriptions and tags
4. Ensure all tests pass locally before pushing
5. Submit PR with test coverage details

### Code Style

- Follow TypeScript strict mode
- Use Web-First locators (not XPath)
- Implement POM for all page interactions
- Write async/await code (no callbacks)
- Add meaningful test descriptions

---

## 📄 License

This project is licensed under the ISC License.

---

## ✉️ Contact & Support

For issues, questions, or contributions, please reach out to the QA automation team.

---

**Last Updated**: June 2026  
**Framework Version**: 1.0.0  
**Playwright Version**: 1.59.1+
