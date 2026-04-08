// Train departures data model definitions for NS API

export interface RawNsApiDepartureResponse {
    readonly payload?: RawNsApiDeparturePayload;
}

export interface RawNsApiDeparturePayload {
    readonly source?: string;
    readonly departures?: TrainDeparture[];
}

export interface TrainDeparture {
    readonly actualDateTime?:        string;
    readonly actualTimeZoneOffset?:  number;
    readonly actualTrack?:           string;
    readonly cancelled?:             boolean;
    readonly departureStatus?:       'ON_STATION' | 'INCOMING' | 'DEPARTED' | 'UNKNOWN';
    readonly direction?:             string;
    readonly messages?:              TrainMessage[];
    readonly name?:                  string;
    readonly plannedDateTime?:       string;
    readonly plannedTimeZoneOffset?: number;
    readonly plannedTrack?:          string;
    readonly product?: {
        readonly categoryCode?:      string;
        readonly longCategoryName?:  string;
        readonly number?:            string;
        readonly operatorCode?:      string;
        readonly operatorName?:      string;
        readonly shortCategoryName?: string;
        readonly type?:              'TRAIN';
    };
    readonly routeStations?: TrainStation[];
    readonly trainCategory?: 'SPR';
}

export interface TrainMessage {
    readonly id:           string;
    readonly externalId:   string;
    readonly head:         string;
    readonly text:         string;
    readonly lead:         string;
    readonly routeIdxFrom: number;
    readonly routeIdxTo:   number;
    readonly type:         'MAINTENANCE' | 'DISRUPTION';
    readonly startDate:    string;
    readonly endDate:      string;
    readonly startTime:    string;
    readonly endTime:      string;
}

export interface TrainStation {
    readonly mediumName: string;
    readonly uicCode:    string;
}
