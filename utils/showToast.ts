interface IToastParams {
    message: string;
    variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
    icon?: string;
    duration?: number;
}

export function showToast(params: IToastParams) {
    const event = new CustomEvent('hgf-helper:showToast', { detail: params });

    window.dispatchEvent(event);
}
