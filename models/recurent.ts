export interface Recurent {
    _id: {
        $oid: string;
    };
    everyWeek: number;
    name: string;
    lastDate: Date;
    link: string;
    type: string;
}

export interface NewRecurent {
    everyWeek: number;
    name: string;
    lastDate: Date;
    link: string;
    type: string;
}

export interface UpdateRecurent {
    everyWeek?: number;
    name?: string;
    lastDate?: Date;
    link?: string;
    type?: string;
}