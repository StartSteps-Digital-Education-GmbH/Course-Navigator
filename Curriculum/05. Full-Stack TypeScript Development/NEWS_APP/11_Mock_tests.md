### **Guide: Writing Mock Tests in TypeScript**

#### **1. Create the Mock File**
Create a mock for the `DataSource` in a reusable file. Use TypeScript types for better type safety and IntelliSense.

**`__mocks__/typeorm.ts`**:
```typescript
import { DataSource } from "typeorm";

const mockDataSource = {
  initialize: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
  manager: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
  getRepository: jest.fn().mockReturnValue({
    save: jest.fn(),
    findOne: jest.fn(),
  }),
};

export const MockDataSource = jest.fn().mockImplementation(() => mockDataSource);

export default {
  DataSource: MockDataSource,
};
```

---

#### **2. Mock the `DataSource` in Your Tests**
In your test file, mock the `DataSource` using `jest.mock`. Use TypeScript types for strong type checking and mock the behavior you want to test.

**`tests/user.test.ts`**:
```typescript
import app from "../index";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { MockDataSource } from "../__mocks__/typeorm";

// Mock the database configuration file
jest.mock("../config/database", () => ({
  AppDataSource: new MockDataSource(), // Replace the actual DataSource with the mock
}));

describe("User Tests with Mock Database", () => {
  const randomUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
  };

  beforeAll(async () => {
    await MockDataSource().initialize();
  });

  afterAll(async () => {
    await MockDataSource().destroy();
  });

  it("should register a User", async () => {
    const mockSave = MockDataSource().getRepository().save;
    mockSave.mockResolvedValue({ id: 1, ...randomUser });

    const res = await request(app).post("/api/users/register").send(randomUser);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User Registered Succefully");
    expect(mockSave).toHaveBeenCalledWith(randomUser);
  });
});
```

---

#### **3. Use TypeScript Types for Better IntelliSense**
You can define a type for the mock object to ensure consistency and avoid runtime errors. 

For example:

**`types/mockDataSource.d.ts`**:
```typescript
import { DataSource } from "typeorm";

export interface MockDataSourceType {
  initialize: jest.Mock;
  destroy: jest.Mock;
  manager: {
    findOne: jest.Mock;
    save: jest.Mock;
  };
  getRepository: jest.Mock<{
    save: jest.Mock;
    findOne: jest.Mock;
  }>;
}

export const MockDataSource: jest.Mock<DataSource, []>;
```

You can then use this type in your test file for strict type checking:

**Updated `tests/user.test.ts`:**
```typescript
import { MockDataSourceType } from "../types/mockDataSource";

const mockSave: jest.Mock = MockDataSource().getRepository().save;
```

---

### **Key Takeaways**
1. **Centralized Mocking:**
   - Place the `DataSource` mock logic in a separate file (e.g., `__mocks__/typeorm.ts`) to maintain consistency across tests.
2. **TypeScript Benefits:**
   - Use TypeScript types and interfaces to ensure that mocks align with the actual implementation.
3. **Mock the Correct Modules:**
   - Use `jest.mock()` to replace the actual `AppDataSource` from your database configuration file with the mocked `MockDataSource`.
4. **Reuse Mocks:**
   - By centralizing the mock file, you can reuse it in multiple test files without duplicating code.
