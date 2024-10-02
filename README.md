# OWASP ASVS Audit tool
Simple UI for using OWASP ASVS framework to evaluate project or application security state. It has bundled [ASVS v4.0.3](https://github.com/OWASP/ASVS/releases/tag/v4.0.3_release) which is current latest release.

## Usage
Whole code is frontend only which means *no data are send outside your local browser*. However it also means that progress is not stored remotely, only in local storage. Currently it support only 1 project at a time, but in future it should support multiple projects with import / export capability.

Start by selecting target level, then you can go control by control and if it is satisfied, mark it with checkbox.

## Contributing
This repo is built using Typescript and React, with [Vite](https://vite.dev/guide/) used as dev server and builder.

Simply start by clonning this repo and running `npm install` in the root of this project. Then start development server using `npm run dev` or export static javascript using `npm run build`.

