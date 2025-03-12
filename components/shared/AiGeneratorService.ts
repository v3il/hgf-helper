import { Timing } from '@farm/consts';
import { SettingsFacade } from '@components/shared/settings';
import { log } from '@components/shared/utils';

interface IMessage {
    role: 'user';
    content: { type: 'text'; text: string }[];
}

interface IRequestData {
    messages: IMessage[];
    model: string;
    temperature: number;
    frequency_penalty: number;
    presence_penalty: number;
    top_p: number;
}

export class AiGeneratorService {
    private readonly apiKey!: string;

    constructor() {
        this.apiKey = SettingsFacade.instance.globalSettings.openAiApiToken;
    }

    async generate(prompt: string, options: Partial<IRequestData> = {}): Promise<string> {
        const controller = new AbortController();
        const { signal } = controller;

        const timeout = setTimeout(() => {
            controller.abort();
        }, 10 * Timing.SECOND);

        const messages = [{
            role: 'user',
            content: [{ type: 'text', text: prompt }]
        }];

        const requestData = { ...this.getDefaultRequestParams(), ...options, messages };

        try {
            const json = await fetch('https://api.openai.com/v1/chat/completions', {
                signal,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestData)
            });

            const response = await json.json();

            return response.choices[0]?.message?.content ?? '';
        } catch (error) {
            log(`AI generation error: ${error}`);
            return '';
        } finally {
            clearTimeout(timeout);
        }
    }

    private getDefaultRequestParams(): Partial<IRequestData> {
        return {
            model: 'gpt-4o-mini',
            temperature: 1.5,
            frequency_penalty: 2,
            presence_penalty: 2,
            top_p: 1
        };
    }
}
