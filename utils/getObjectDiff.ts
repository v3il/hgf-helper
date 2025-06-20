import { isEqual, isPlainObject, union, keys, isEmpty } from 'lodash';

export function getObjectDiff<T extends object>(source: T, target: T): Partial<T> {
    const result: any = {};
    const allKeys = union(keys(source), keys(target));

    for (const key of allKeys) {
        // @ts-ignore
        const srcVal = source[key];
        // @ts-ignore
        const tgtVal = target[key];

        if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
            const nestedDiff = getObjectDiff(srcVal, tgtVal);

            if (!isEmpty(nestedDiff)) result[key] = nestedDiff;
        } else if (!isEqual(srcVal, tgtVal)) {
            result[key] = tgtVal;
        }
    }

    return result;
}
