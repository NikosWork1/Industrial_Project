# Database Diagnostics

This directory contains diagnostic tools for troubleshooting database issues.

## Available Diagnostics

### 1. `db-diagnostic.js`
Comprehensive database health check that tests:
- Database connection
- Table existence
- Record counts
- Create/update operations
- Transaction handling
- Mock data references

**Usage:**
```bash
node diagnostic/db-diagnostic.js
```

### 2. `check-db-config.js`
Quick configuration check that verifies:
- Configuration settings
- Database file location and permissions
- Environment variables

**Usage:**
```bash
node diagnostic/check-db-config.js
```

### 3. `test-db-write.js`
Tests database write operations including:
- Direct SQL inserts
- Sequelize operations
- Update operations
- Transaction tests
- SQLite configuration

**Usage:**
```bash
node diagnostic/test-db-write.js
```

### 4. `init-database.js`
Initializes or resets the database with:
- Table creation
- Default schools
- Default admin user

**Usage:**
```bash
node diagnostic/init-database.js
```

## When to Use These Tools

- **After deployment**: Run `db-diagnostic.js` to verify everything is working
- **Configuration issues**: Use `check-db-config.js` to verify paths and permissions
- **Write failures**: Run `test-db-write.js` to isolate write problems
- **Fresh setup**: Use `init-database.js` to set up a new database

## Common Issues

1. **Wrong database path**: Check with `check-db-config.js`
2. **Missing tables**: Run `init-database.js`
3. **Write failures**: Test with `test-db-write.js`
4. **General health check**: Use `db-diagnostic.js`