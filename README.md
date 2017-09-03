# Nereo CLI

A CLI for Nereo — Leave Management SaaS

![nereo-cli-screenshot](https://i.imgur.com/QoVZsj7.png)

## Installation

```bash
npm install -g nereo-cli # Requires Node >= 4
nereo-cli
```

## Features

As of now, the following features have been implemented:

- Login with Nereo
- Display current balances

## Commands

- `help`: Displays help
- `login`: Login to Nereo using a Developer Token. Required for displaying balances.
- `balances`: Display current balances
- `version`: Display installed `nereo-cli` version.

## Roadmap

- [ ] Add tests 😅
- [ ] Manage dates dynamically (as of now, this CLI tool can only work for September 2017)
- [ ] Implement `balances YYYY-MM-DD` to display future balances

## Is it any good?

[Yes](https://news.ycombinator.com/item?id=3067434)
