import { TailRank } from '@termsurf/tail';
type Base = {
    execution_time: {
        take: {
            title: string;
            baz?: number | null;
            boop?: Array<boolean>;
        };
    };
};
type Name = keyof Base;
export default function tail<N extends Name>({ rank, form, ...take }: {
    rank?: TailRank;
    form: N;
} & Base[N]['take']): void;
export {};
