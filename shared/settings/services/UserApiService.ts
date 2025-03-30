import { FUNCTION_URL } from '@shared/consts';
import { IUser } from '@shared/settings';

export class UserApiService {
    readonly AUTH_URL = `${FUNCTION_URL}/auth`;

    async getUser(token: string) {
        const response = await fetch(`${FUNCTION_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const json = await response.json();

        return json.user as IUser;
    }

    async updateSettings(token: string, settings: any) {
        await fetch(`${FUNCTION_URL}/user`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
    }
}
