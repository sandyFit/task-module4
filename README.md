# WebdriverIO BDD Test Automation Suite

This project contains an automated test suite built using **WebdriverIO**, **Cucumber BDD**, and **Node.js**, following the structure and requirements of the EPAM Testing Specialization Module 4.

---

## **Requirements**

| Requirement                                            | Status                | Notes                                           |
| ------------------------------------------------------ | --------------------- | ----------------------------------------------- |
| 1. Walk through materials to understand WDIO           | ✔ Completed           | WDIO config & structure implemented             |
| 2. Create initial WDIO setup locally                   | ✔ Completed           | Using Windows environment                       |
| 3. Create WDIO config & get familiar                   | ✔ Completed           | Custom config included                          |
| 4. Create first specs using BDD scenario from Module 2 | ✔ Completed           | All feature files under `/src/features`         |
| 5. Execute tests in Chrome / Firefox / Safari headless | ⚠ Partially completed | Safari unavailable on Windows (explained below) |
| 6. Execute tests in parallel (2 instances)             | ✔ Completed           | `maxInstances: 2`                               |
| 7. Add option to retry failed tests twice              | ✔ Completed           | `specFileRetries: 2`                            |
| 8. Push code & open Merge Request                      | ✔ Completed           | Ready for MR                                    |

---

## **Why Safari Was Not Added**

Safari WebDriver is **only supported on macOS**.
Because this project was developed on **Windows**, attempts to run Safari tests would fail immediately.

Therefore, only **Chrome** and **Firefox** were configured — both in **headless mode**, as required.

---

## **Project Structure**

```
src/
 ├── features/          # .feature files (Gherkin)
 │     ├── signup.feature
 │     ├── login.feature
 │     └── ...
 ├── steps/             # Step definitions
 ├── assertions/        # Custom assertions
 ├── hooks/             # WDIO hooks (setup, before/after scenarios)
 ├── data/              # Test data
 └── helpers/           # Reusable helper functions
wdio.conf.js            # Main WDIO configuration
```

---

## **Running the Tests**

### Install dependencies:

```bash
npm install
```

### Run all tests in headless mode:

```bash
npm run wdio
```

### Run a specific feature:

```bash
npm run wdio run wdio.conf.js --spec ./src/features/login.feature
```

---

## **WDIO Capabilities**

Tests run in **parallel** using:

### Chrome (Headless)

* fast
* stable
* modern Chrome WebDriver

### Firefox (Headless)

* cross-browser validation
* GeckoDriver support

### Safari (Not supported on Windows)

Safari WebDriver is excluded due to OS limitations.

---

## **Retry Logic**

To improve test stability, each spec file is retried **up to 2 times**:

```js
specFileRetries: 2
```

---

## **Cucumber BDD**

The framework uses:

* Gherkin `.feature` files
* Step definitions in `/steps`
* Assertions in `/assertions`

This helps maintain clean separation of **intent (Gherkin)** and **implementation (JS)**.

---

## 🧪 **Parallel Execution**

WDIO is configured to run tests using:

```js
maxInstances: 2
maxInstancesPerCapability: 2
```

This means **2 sessions across both Chrome and Firefox** can run simultaneously, improving performance.

---

## 📦 **Dependencies**

Key packages used:

* `@wdio/cli`
* `@wdio/local-runner`
* `@wdio/cucumber-framework`
* `@wdio/spec-reporter`
* `@wdio/chromedriver-service`
* `@wdio/firefox-profile-service`

---

## 📝 License

This project is part of the EPAM Testing Automation training program.



