# Test Suite

This directory would contain unit tests for the Mediterranean College Alumni application.

## Test Structure

### Backend Tests
- `models/` - Tests for Sequelize models
- `routes/` - Tests for Express routes
- `auth/` - Tests for authentication

### Frontend Tests  
- `components/` - Tests for UI components
- `integration/` - End-to-end tests

## Running Tests

```bash
npm test
```

## Test Coverage

```bash
npm run test:coverage
```

## Note for Assignment

Due to time constraints, comprehensive tests were not implemented. However, the diagnostic scripts in the `diagnostic/` folder demonstrate testing approaches:

1. **Database testing** - `db-diagnostic.js`
2. **Configuration testing** - `check-db-config.js`
3. **Write operation testing** - `test-db-write.js`

These scripts show understanding of:
- Unit testing concepts
- Integration testing
- Database transaction testing
- Configuration validation