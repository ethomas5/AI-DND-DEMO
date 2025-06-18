# AI Dungeon-Master Bot (created using Azure Foundry Hub AI Agents)

## Overview

---
This project contains all the code for a basic MVP showcasing a text-based RPG that uses the DND 5E ruleset.

The AI agents have been primarily configured within the Azure Portal, although some configurations that are not possible
without an in-code implementation have also been used (custom function, maintaining state via Azure Blob Storage, etc.).

## Structure

---
This project is divided into three individual components:
1. Basic UI that mimics a "chat application", displaying user messages and the accompanying AI responses.
2. NodeJS/Express middleware that handles the communication between the UI and the Azure AI agents.
3. Azure AI agents that are configured to handle the game logic.
   - These AI agents are given two documents: The 5E DM Basic Rules Handbook and the 5E Player's Basic Rules Handbook.
   Along with this, they have access to multiple local JSON files that maintain things like player state, items, etc.

## Starting up

---
The startup process is fairly simple, only requiring that the NodeJS/Express server is started, along with an authentication
check for the Azure CLI (to ensure that the Azure AI agents can be accessed).
After this, the UI can be accessed via a web browser at `http://localhost:3000` and directly typed into to start a campaign.

## Strengths

---
- The AI agents are able to handle a wide variety of scenarios and do a fairly good job of creating scenes over time.
- Game state is maintained relatively well (although can be a little finicky).
- The AI agent does a decent job as sounding similar to a human DM and can react in ways that make sense.

## Weaknesses

---
- While technically dynamic (in the way that the AI creates scenarios), it does have a somewhat limited way of responding
to completely custom decisions. Rather, it will offer a couple different options for the character to choose from.
- Difficult to maintain complex character progressions (like certain amounts of EXP rather than a full level), as context can
be eaten up quickly.
- Mostly due to inexperience on my part, the character state is maintained in a local JSON file, meaning that it is session 
specific. It is possible to use Azure Blob Storage to maintain this state, but I do not have enough knowledge of the Azure system
to do this correctly and with intention.

## Future Improvements

---
- Going back immediately, implementing character state management via Azure Blob Storage.
- Finding a way to more efficiently manage context so that the AI agent can handle more complex scenarios.
- Small nitpick, but implement Markdown support in the UI so that the AI agent can format its responses better (it already
- has a tendancy to use markdown formatting anyways).

