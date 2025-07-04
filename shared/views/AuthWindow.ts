export class AuthWindow {
    private window: Window | null = null;
    private intervalId!: number;

    async open(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.window = window.open(url, '_blank', 'width=600,height=600');

            if (!this.window) {
                reject(new Error('Failed to open auth window'));
                return;
            }

            this.intervalId = window.setInterval(() => {
                if (this.window?.closed) {
                    clearInterval(this.intervalId);
                    reject(new Error('Auth window closed before receiving token'));
                }
            }, 100);

            window.addEventListener('message', (event) => {
                const { type, token } = event.data;

                if (type === 'hgf-auth') {
                    clearInterval(this.intervalId);
                    resolve(token);
                }
            });
        });
    }
}
