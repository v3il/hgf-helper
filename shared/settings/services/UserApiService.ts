import { FUNCTION_URL } from '@shared/consts';
import { ISettings, IUser } from '@shared/settings';

export class UserApiService {
    private token!: string;

    setToken(token: string) {
        this.token = token;
    }

    async getUser() {
        const response = await fetch(`${FUNCTION_URL}/user`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });

        const json = await response.json();

        return json.user as IUser;
    }

    async updateSettings(settings: ISettings) {
        await fetch(`${FUNCTION_URL}/user`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ settings })
        });
    }
}
