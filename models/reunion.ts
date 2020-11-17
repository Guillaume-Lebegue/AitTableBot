export interface Reunion {
    id: string;
    fields: ReunionField;
    createdTime: Date;
}

export interface ReunionField {
    Name: string;
    Notes?: string;
    Status: ReunionStatus;
    Date: Date;
    Lien?: String;
    type?: String;
};

export enum ReunionStatus {
    coming = "A venir",
    passed = "Passé",
};

export interface ReunionPatch {
    id: string;
    fields: ReunionFieldPatch;
}

export interface ReunionFieldPatch {
    Name?: string;
    Notes?: string;
    Status?: ReunionStatus;
    Date?: Date;
    Lien?: String;
    type?: String;
};