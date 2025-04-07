export class AuthWindow {
    private window: Window | null = null;

    async open(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.window = window.open(url, '_blank', 'width=600,height=600');

            if (!this.window) {
                reject(new Error('Failed to open auth window'));
                return;
            }

            window.addEventListener('message', (event) => {
                const { type, token } = event.data;

                if (type === 'hgf-auth') {
                    resolve(token);
                }
            });
        });
    }
}
