# Contributing

Thank you for your interest in improving `@celo/rainbowkit-celo`.

If you want to contribute, but aren't sure where to start, you can create a
[new discussion](https://github.com/celo-org/rainbowkit-celo/discussions).

There are multiple opportunities to contribute. It doesn't matter if you are just
getting started or are an expert. We appreciate your interest in contributing.

> **IMPORTANT**
> Please ask before starting work on any significant new features.
>
> It's never a fun experience to have your pull request declined after investing time and effort
> into a new feature. To avoid this from happening, we invite contributors to create a
> [new discussion](https://github.com/celo-org/rainbowkit-celo/discussions) to discuss API changes or
> significant new ideas.

## Basic guide

This guide is intended to help you get started with contributing. By following these steps,
you will understand the development process and workflow.

### Cloning the repository

To start contributing to the project, clone it to your local machine using git:

```sh
$ git clone https://github.com/celo-org/rainbowkit-celo.git
```

Navigate to the project's root directory:

```sh
$ cd rainbowkit-celo
```

### Installing Node.js

We use [Node.js](https://nodejs.org/en/) to run the project locally.
You need to install the **Node.js version** specified in [package.json > engines](./package.json). 

### Installing dependencies

Once in the project's root directory, run the following command to install the project's 
dependencies:

```sh
$ yarn install
```

After installing the dependencies, the project is ready to be run. 

### Navigating the repository

The project is structured into a package (in [`packages/rainbowkit-celo/`](./packages/rainbowkit-celo/)) 
and an example app (in [`apps/example`](./apps/example)).

### Running packages

Once you navigated to the project directory you want to run, inspect the `package.json` file
and look for the `scripts` section. It contains the list of available scripts that can be run.

### Versioning

When adding new features or fixing bugs in `@celo/rainbowkit-celo`, we'll need to bump the package versions. 
We use [Changesets](https://github.com/changesets/changesets) to do this.

> **INFO**
> Only changes to the codebase that affect the public API or existing behavior (e.g. bugs) 
> need changesets.

Each changeset defines which package(s) should be published and whether the change should be a 
major/minor/patch release, as well as providing release notes that will be added to the changelog 
upon release.

To create a new changeset, run:

```sh
$ yarn run changeset
```

This will run the Changesets CLI, prompting you for details about the change. 
You’ll be able to edit the file after it’s created — don’t worry about getting everything perfect 
up front.

Even though you can technically use any markdown formatting you like, headings should be avoided 
since each changeset will ultimately be nested within a bullet list. Instead, bold text should be 
used as section headings.

If your PR is making changes to an area that already has a changeset (e.g. there’s an existing 
changeset covering theme API changes but you’re making further changes to the same API), you 
should update the existing changeset in your PR rather than creating a new one.

### Running the test suite 

Unfortunately, we don't have a consistent test suite for this package.

When you open a Pull Request, the GitHub CI will run any available test suites for you, but 
you can also add and run tests locally.

> **INFO**
> Some tests are run automatically when you open a Pull Request, while others are run when a 
> maintainer approves the Pull Request. This is for security reasons, as some tests require access 
> to secrets.

### Open a Pull Request

✅ Now you're ready to contribute to `@celo/rainbowkit-celo`!
