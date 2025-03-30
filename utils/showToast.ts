import { Toast } from 'bootstrap';

interface IParams {
    type: 'success' | 'error' | 'info' | 'warning';
}

const toastClasses: Record<IParams['type'], string> = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-info text-black',
    warning: 'bg-warning text-black'
};

export function showToast(message: string, params: IParams = { type: 'success' }) {
    let toastContainer = document.getElementById('toastContainer');

    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.id = 'toastContainer';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');

    toastEl.className = `toast ${toastClasses[params.type]} border-0`;
    toastEl.role = 'alert';
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    toastContainer.appendChild(toastEl);

    const toast = new Toast(toastEl);
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
