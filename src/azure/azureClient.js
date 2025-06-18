import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import {FunctionToolExecutor} from "./helpers.js";


let threadId;
const assistantId = "asst_oSPM6fLMG57EBZu59s7Jnu7w"
const project = new AIProjectClient(
    "https://450hub3592146685.services.ai.azure.com/api/projects/450hub3592146685-project",
    new DefaultAzureCredential());
const toolExecutor = new FunctionToolExecutor();

// taken from Azure AI Agents documentation (with some minor modifications)
async function runAgentConversation() {
    await toolExecutor.readCharInfoTool()

    const agent = await project.agents.getAgent(assistantId);
    console.log(`Retrieved agent: ${agent.name}`);

    // create new thread
    const thread = await project.agents.threads.create();
    threadId = thread.id;
    console.log(`Retrieved thread, thread ID: ${thread.id}`);

    // create run
    // difficulties getting tools to work properly, so forgoing them for now
    let run = await project.agents.runs.create(thread.id, agent.id);


    while (run.status === "queued" || run.status === "in_progress") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        run = await project.agents.runs.get(thread.id, run.id);
    }

    if (run.status === "failed") {
        console.error(`Run failed: `, run.lastError);
    }

    console.log(`Run completed with status: ${run.status}`);

    // retrieve messages
    const messages = await project.agents.messages.list(thread.id, { order: "asc" });

    // display messages
    for await (const m of messages) {
        const content = m.content.find((c) => c.type === "text" && "text" in c);
        if (content) {
            console.log(`${m.role}: ${content.text.value}`);
        }
    }
}

// intended for use to create a new message thread while storing older thread for potential future use
export async function createNewAgentThread() {
    const agent = await project.agents.getAgent(assistantId);
    const thread = await project.agents.threads.create();
    console.log(`Created new thread with ID: ${thread.id} for agent: ${agent.name}`);
    return { thread, agent };
}

// function to send a message to the agent and get the response
// functionally similar to the runAgentConversation function, but runs with every front-end message request, also uses existing thread
export async function sendMessageToAgent(userMessage) {
    const agent = await project.agents.getAgent(assistantId);

    // use old thread (will always exist after initial runAgentConversation call)
    const thread = await project.agents.threads.get(threadId);
    await project.agents.messages.create(thread.id, "user", userMessage);

    // difficulties getting tools to work properly, so forgoing them for now
    let run = await project.agents.runs.create(thread.id, agent.id);
    while (run.status === "queued" || run.status === "in_progress") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        run = await project.agents.runs.get(thread.id, run.id);
    }
    if (run.status === "failed") {
        return { error: run.lastError };
    }
    const messages = await project.agents.messages.list(thread.id, { order: "asc" });
    let agentResponse = null;
    for await (const m of messages) {
        if (m.role === "assistant") {
            const content = m.content.find((c) => c.type === "text" && "text" in c);
            if (content) {
                agentResponse = content.text.value;
            }
        }
    }
    return { response: agentResponse };
}

// run driver function
runAgentConversation().catch(error => {
    console.error("An error occurred:", error);
});
