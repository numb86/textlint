// LICENSE : MIT
"use strict";
import { IgnoreReportedMessage, LintReportedMessage } from "../task/textlint-core-task";
import { TextLintMessage } from "../textlint-kernel-interface";

export type PreMessageProcessor = (messages: Array<LintReportedMessage | IgnoreReportedMessage>) => Array<LintReportedMessage | IgnoreReportedMessage>;
export type MessageProcessor = (messages: TextLintMessage[]) => TextLintMessage[];

export default class MessageProcessManager {
    private _preProcessors: PreMessageProcessor[];
    private _processors: MessageProcessor[];

    /**
     * Preprossor
     */
    constructor(preProcessors: PreMessageProcessor[]) {
        this._preProcessors = preProcessors || [];
        this._processors = [];
    }

    add(messageProcessor: MessageProcessor) {
        this._processors.push(messageProcessor);
    }

    remove(process: MessageProcessor) {
        const index = this._processors.indexOf(process);
        if (index !== -1) {
            this._processors.splice(index, 1);
        }
    }

    /**
     * process `messages` with registered processes
     * @param {TextLintMessage[]} messages
     * @returns {TextLintMessage[]}
     */
    process(messages: Array<LintReportedMessage | IgnoreReportedMessage>): TextLintMessage[] {
        const originalMessages = messages;
        if (this._preProcessors.length === 0) {
            throw new Error("pre process should be > 0");
        }
        const preProcessedMesssages = this._preProcessors.reduce((messages, filter) => {
            return filter(messages);
        }, originalMessages) as TextLintMessage[];
        if (this._processors.length === 0) {
            return preProcessedMesssages;
        }
        return this._processors.reduce((messages, filter) => {
            return filter(messages);
        }, preProcessedMesssages);
    }
}
