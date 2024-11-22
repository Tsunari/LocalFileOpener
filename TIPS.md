# Tips


## Load modules from pacakage-lock.json
To install all `node_modules` from `package-lock.json` you can use the following command:

```sh
npm ci
```

This command will install the exact versions of the dependencies specified in the `package-lock.json` file.

## Initialize ESLint configuration

To ensure a properly initialized ESLint configuration for a standard JavaScript project, you can follow these steps:

1. Install ESLint as a development dependency:

    ```sh
    npm install eslint --save-dev
    ```

2. Initialize ESLint in your project:

    ```sh
    npx eslint --init
    ```

    Follow the prompts to set up your configuration. Choose the options that best fit your project's needs.

3. Create a `.eslintrc.json` file if it doesn't exist and configure it according to your preferences. Here is an example configuration:

    ```json
    {
        "env": {
            "browser": true,
            "es2021": true
        },
        "extends": "eslint:recommended",
        "parserOptions": {
            "ecmaVersion": 12,
            "sourceType": "module"
        },
        "rules": {
            "indent": ["error", 2],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "single"],
            "semi": ["error", "always"]
        }
    }
    ```

4. Run ESLint on your project files to check for any linting errors:

    ```sh
    npx eslint .
    ```

This will ensure that your project is set up with ESLint and follows standard JavaScript coding practices.
