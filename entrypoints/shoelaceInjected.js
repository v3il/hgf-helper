import { defineUnlistedScript } from 'wxt/sandbox';
import '@shoelace-style/shoelace/dist/shoelace.js';

// interface IToastParams {
//     message: string;
//     variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
//     icon: string;
//     duration: number;
// }

export function showToast(params) {
    const message = params?.message ?? 'No message provided';
    const variant = params?.variant ?? 'primary';
    const icon = params?.icon ?? 'check-circle';
    const duration = params?.duration ?? 5000;

    const alert = Object.assign(document.createElement('sl-alert'), {
        variant,
        closable: true,
        duration,
        innerHTML: message
        // `
        //     <sl-icon name="${icon}" slot="icon"></sl-icon>
        //     ${message}
        // `
    });

    document.body.append(alert);
    return alert.toast();
}

export default defineUnlistedScript(() => {
    window.addEventListener('hgf-helper:showToast', ({ detail }) => {
        showToast(detail);
    });
});
