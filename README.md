# `hi`, a command line tool for ServiceNow employees

`hi` uses the available APIs and git commands to display your branches and a PRB's short description to your console. The goal is to make it easier to map scratch branches to PRBs.

## Installation (Pending)
`npm install -g sn-hi`

## How to use
- Run the command `hi auth` and provide your HI credentials. The credentials are stored in base64-encoding and in a configuration file.
    - The configuration file can be found in `${HOME}/.hiconfig`
- Run the command `hi branch` to display your branches and their associated PRB's short description.

## Example

```
yonatanperez@Yonatans-MacBook-Pro hi $ hi branch
  example/PRB1234567 - This is a PRB's short description
* master - No PRB/INT attached to this branch
```

## Goals
- Add support for STRYs and TASKs.
- Provide a command to set a custom short description for a branch to minimize requests
- Add tests
- Add badge to repo
