// Waste collection schedules data model definitions for MijnAfvalwijzer API

export interface RawMijnAfvalwijzerResponse {
    readonly response?: string;
    readonly data?:     RawMijnAfvalwijzerPayload;
    readonly error?:    string;
}

export interface RawMijnAfvalwijzerPayload {
    readonly gemeente?: string;
    readonly info?: RawWasteCollectionInfo;
    readonly langs?: {
        readonly response?: string;
        readonly data?: Record<string, string>;
        readonly error?: string;
    };
    readonly options?: any;
    readonly ophaaldagen?: {
        readonly response?: string;
        readonly data?: RawWasteCollectionDay[];
        readonly error?: any;
    },
    /* There's more... */
}

export interface RawWasteCollectionInfo {
    readonly postcode?: string;
    readonly huisnummer?: string;
    readonly straat?: string;
    readonly street?: string;
    readonly letter?: string;
    readonly plaats?: string;
    readonly latitude?: string;
    readonly longitude?: string;
    readonly version?: number;
    readonly afvaldataVersion?: string;
    readonly contentVersion?: string;
    readonly iconsVersion?: string;
    readonly templatesVersion?: string;
    readonly pushNotificationID?: string;
    readonly gemeenteName?: string;
    readonly country?: string;
    readonly customerID?: string;
    readonly afvalDataId?: string;
    readonly afvalshopEmail?: string;
    /* There's more... */
}

export interface RawWasteCollectionDay {
    nameType: string;
    type: string;
    date: string;
}

export type DateName = '' | 'yesterday' | 'today' | 'tomorrow';

/** Derived, improved collection scchedule item. */
export interface WasteCollectionDay {
    type:     string;
    date:     Date;
    dateName: DateName;
}
