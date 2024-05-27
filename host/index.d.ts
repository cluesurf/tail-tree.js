import { TailRank } from '@termsurf/tail';
export declare const makeTextHead: ({ time, rank, host, note, showHost, showForm, }: {
    time: string;
    rank: TailRank;
    note: string;
    host: string;
    showHost?: boolean | undefined;
    showForm?: boolean | undefined;
}) => string[];
export type MakeText = {
    host: string;
    form: string;
    rank: TailRank;
    time: string;
    note: string;
    link?: Record<string, unknown>;
    showHost?: boolean;
    showForm?: boolean;
};
/**
 * This you pass it a stack trace and it will render the error text.
 */
declare const makeText: ({ host, form, time, rank, note, link, showHost, showForm, }: MakeText) => string;
export default makeText;
