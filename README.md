# E-commerce A/B Testing Platform

This project consists of three parts:

1. E-commerce Frontend (main application)
2. Backend Server
3. A/B Testing Dashboard

## Setup Instructions

### 1. E-commerce Frontend

From the root directory

```
npm install
ng serve
```

The frontend must run on port 4200: `http://localhost:4200`

### 2. Backend Server

From the `ecomm-backend` directory

```
npm install
npm run start
```

The backend must run on port 3000: `http://localhost:3000`

### 3. A/B Testing Dashboard

From the `ecomm-backend` directory

```
npm run dashboard
```

The dashboard can run on any available port. It will automatically connect to the frontend running on port 4200.

## Important Notes

- The frontend must run on port 4200 for the A/B testing functionality to work
- Start the applications in this order:
  1. Frontend (port 4200)
  2. Backend server (port 3000)
  3. Dashboard (any port)
- The dashboard needs both the frontend and backend to be running to function properly

## Development

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running End-to-End Tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
