import { ICheckPoint } from './ICheckPoint';
import { rightAntiCheatChecks } from './antiCheatChecks';

export const blackScreenChecks: ICheckPoint[] = rightAntiCheatChecks.map(({ xPercent, yPercent }) => ({
    xPercent,
    yPercent,
    color: '#000000'
}));
