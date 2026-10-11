# React + TypeScript + Vite

## Set or reset the admin password

The seed data creates `admin@example.com` without a password. From the `server` directory, run:

```sh
npm run set-admin-password
```

The command connects to MongoDB using `MONGO_URI` or `MONGODB_URI` from `server/.env`, then securely prompts twice for a password without displaying it. It updates the existing admin account or creates it if it does not exist. To use a different admin email, set `ADMIN_EMAIL` for that terminal session before running the command. Sign in from the client with that email and the password you entered.

This password setup command does not clear or reseed any database data.

## Email verification and password reset

Create an EmailJS service and one template. Set its **To Email** field to `{{to_email}}` and include `{{otp}}` in the email body where the six-digit code should appear (for example, `Your verification code is {{otp}}`). The server also sends `{{code}}`, `{{verification_code}}`, and `{{passcode}}` as aliases for templates using those names. Add these values to `server/.env`:

```dotenv
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

The API sends sign-up verification and password reset codes through EmailJS; the private key and OTP remain on the server. Codes are stored only as keyed hashes in MongoDB, expire after 10 minutes, allow at most five attempts, and each email can request one code per flow per minute. Set a stable random `AUTH_TOKEN_SECRET` in `server/.env` so challenges and sessions remain valid across server restarts.

## Keep admin sessions valid across server restarts

Set a long random `AUTH_TOKEN_SECRET` value in `server/.env`. The server uses it to sign login sessions; if it is omitted, a temporary secret is generated at startup and everyone must sign in again after each restart. Never put this secret in the client app or commit it to source control.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
