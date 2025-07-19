import { ICheckPoint } from './ICheckPoint';
import { antiCheatChecks } from './antiCheatChecks';

export const blackScreenChecks: ICheckPoint[] = antiCheatChecks.map(({ xPercent, yPercent }) => ({
    xPercent,
    yPercent,
    color: '#000000'
}));
