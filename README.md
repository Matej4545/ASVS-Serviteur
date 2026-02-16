# OWASP ASVS Serviteur

![image](./public/asvs-serviteur.svg)
Simple UI for using OWASP ASVS framework to evaluate project or application security state. It has bundled [ASVS v5.0.0](https://github.com/OWASP/ASVS/releases/tag/v5.0.0) which is the latest release.

## Usage

Whole code is frontend only which means _no data are send outside your local browser_. However it also means that progress is not stored remotely, only in local storage. Currently it support only 1 project at a time, but can be easily extended for multiple project support using different `localStorage` keys or storage format. 

Start by creating new project and setting target ASVS level. Then you can start filling the audit for your project. When you are finished, generate report using "scroll" icon in top navbar.

## Contributing

This repo is built using Typescript and React, with [Vite](https://vite.dev/guide/) used as dev server and builder.

Simply start by clonning this repo and running `npm install` in the root of this project. Then start development server using `npm run dev` or export static javascript using `npm run build`.