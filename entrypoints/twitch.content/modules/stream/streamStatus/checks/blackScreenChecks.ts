import { ICheck } from './ICheck';
import { antiCheatChecks } from './antiCheatChecks';

export const blackScreenChecks: ICheck[] = antiCheatChecks.map(({ xPercent, yPercent }) => ({
    xPercent,
    yPercent,
    color: '#000000'
}));
