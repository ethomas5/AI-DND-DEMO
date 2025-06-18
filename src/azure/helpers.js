import {ToolUtility} from "@azure/ai-agents";
import path from "path";
import fs from "fs/promises";

/**
 * General purpose helper functions
 * Includes tool custom functions for AI to manage state and simulate dice rolls
 */

export class FunctionToolExecutor {
    functionTools;

    constructor() {
        this.functionTools = [
            {
                func: this.rollD4Tool,
                ...ToolUtility.createFunctionTool({
                    name: "rollD4Tool",
                    description: "Rolls a D4 dice. Use when executing a task that requires a D4 roll.",
                    parameters: {},
                }),
            },
            {
                func: this.rollD6Tool,
                ...ToolUtility.createFunctionTool({
                    name: "rollD6Tool",
                    description: "Rolls a D6 dice. Use when executing a task that requires a D6 roll.",
                    parameters: {},
                }),
            },
            {
                func: this.rollD8Tool,
                ...ToolUtility.createFunctionTool({
                    name: "rollD8Tool",
                    description: "Rolls a D8 dice. Use when executing a task that requires a D8 roll.",
                    parameters: {},
                }),
            },
            {
                func: this.rollD10Tool,
                ...ToolUtility.createFunctionTool({
                    name: "rollD10Tool",
                    description: "Rolls a D10 dice. Use when executing a task that requires a D10 roll.",
                    parameters: {},
                }),
            },
            {
                func: this.rollD12Tool,
                ...ToolUtility.createFunctionTool({
                    name: "rollD12Tool",
                    description: "Rolls a D12 dice. Use when executing a task that requires a D12 roll.",
                    parameters: {},
                }),
            },
            {
                func: this.rollD20Tool,
                ...ToolUtility.createFunctionTool({
                    name: "rollD20Tool",
                    description: "Rolls a D20 dice. Use when executing a task that requires a D20 roll.",
                    parameters: {},
                }),
            },
            {
                func: this.rollD100Tool,
                ...ToolUtility.createFunctionTool({
                    name: "rollD100Tool",
                    description: "Rolls a D100 dice. Use when executing a task that requires a D100 roll.",
                    parameters: {},
                }),
            },
            {
                func: this.readCharInfoTool,
                ...ToolUtility.createFunctionTool({
                    name: "readCharInfoTool",
                    description: "Checks/Reads the player character's information. Use when retrieving information about the player character or before updating character information.",
                    parameters: {},
                }),
            },
            {
                func: this.readCharInvTool,
                ...ToolUtility.createFunctionTool({
                    name: "readCharInvTool",
                    description: "Checks/Reads the player character's inventory. Use when retrieving information about the player character's inventory or before updating character inventory.",
                    parameters: {},
                }),
            },
            {
                func: this.readCharSpellsTool,
                ...ToolUtility.createFunctionTool({
                    name: "readCharSpellsTool",
                    description: "Checks/Reads the player character's spellbook. Use when retrieving information about the player character's spellbook or before updating character spellbook.",
                    parameters: {},
                }),
            },
            {
                func: this.updateCharInfoTool,
                ...ToolUtility.createFunctionTool({
                    name: "updateCharInfoTool",
                    description: "Updates the player character's information. Use when character information needs to be updated, such as leveling up, changing attributes, speccing into a new class, etc.",
                    parameters: {
                        type: "object",
                        properties: {
                            key: {
                                type: "string",
                                description: "the attribute to update in the info",
                            },
                            value: {
                                type: "string",
                                description: "the value to update in the info",
                            }
                        }
                    },
                }),
            },
            {
                func: this.updateCharInvTool,
                ...ToolUtility.createFunctionTool({
                    name: "updateCharInvTool",
                    description: "Updates the player character's inventory. Use when character inventory needs to be updated, such as using an item, storing a new item, using money, etc.",
                    parameters: {
                        type: "object",
                        properties: {
                            key: {
                                type: "string",
                                description: "the attribute to update in the inventory",
                            },
                            value: {
                                type: "string",
                                description: "the value to update in the inventory",
                            }
                        }
                    },
                }),
            },
            {
                func: this.updateCharSpellbookTool,
                ...ToolUtility.createFunctionTool({
                    name: "updateCharSpellbookTool",
                    description: "Updates the player character's spellbook. Use when character spellbook needs to be updated, such as leveling up, learning new spells, setting new prepared spells, etc.",
                    parameters: {
                        type: "object",
                        properties: {
                            key: {
                                type: "string",
                                description: "the attribute to update in the spellbook",
                            },
                            value: {
                                type: "string",
                                description: "the value to update in the spellbook",
                            }
                        }
                    },
                }),
            },
        ];
    }

    async readJsonTool(filename) {
        const filePath = path.resolve(filename);

        try {
            const content = await fs.readFile(filePath, "utf-8");
            const parsed = JSON.parse(content);
            return { content: parsed };
        } catch (err) {
            return { error: `Failed to read file: ${err.message}` };
        }
    }

    async readCharInfoTool() {
        return await this.readJsonTool("../db/player-info.json")
    }

    async readCharInvTool() {
        return await this.readJsonTool("../db/player-inventory.json")
    }

    async readCharSpellsTool() {
        return await this.readJsonTool("../db/player-spellbook.json")
    }

    async updateCharInfoTool({ key, value }) {
        try {
            const filePath = path.resolve("../db/player-info.json");
            const data = JSON.parse(await fs.readFile(filePath, "utf8"));
            data[key] = value;
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            return { message: `Updated ${key} to ${value}` };
        } catch (err) {
            return { error: `Failed to write to file: ${err.message}`};
        }
    }

    async updateCharInvTool({ key, value }) {
        try {
            const filePath = path.resolve("../db/player-inventory.json");
            const data = JSON.parse(await fs.readFile(filePath, "utf8"));
            data[key] = value;
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            return { message: `Updated ${key} to ${value}` };
        } catch (err) {
            return { error: `Failed to write to file: ${err.message}`};
        }
    }

    async updateCharSpellbookTool({ key, value }) {
        try {
            const filePath = path.resolve("../db/player-spellbook.json");
            const data = JSON.parse(await fs.readFile(filePath, "utf8"));
            data[key] = value;
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            return { message: `Updated ${key} to ${value}` };
        } catch (err) {
            return { error: `Failed to write to file: ${err.message}`};
        }
    }

    // General roll dice function
    rollDie = (sides) => {
        console.log(`Rolling a D${sides}`);
        return Math.floor(Math.random() * sides) + 1;
    }

    // Specific dice functions
    rollD4Tool = () => {
        return this.rollDie(4);
    }

    rollD6Tool = () => {
        console.log("Rolling a D6");
        return this.rollDie(6);
    }

    rollD8Tool = () => {
        return this.rollDie(8);
    }

    rollD10Tool = () => {
        return this.rollDie(10);
    }

    rollD12Tool = () => {
        return this.rollDie(12);
    }

    rollD20Tool = () => {
        return this.rollDie(20);
    }

    rollD100Tool = () => {
        return this.rollDie(100);
    }

    getFunctionDefinitions() {
        return this.functionTools.map((tool) => {
            return tool.definition;
        });
    }
}