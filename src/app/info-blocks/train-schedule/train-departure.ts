export interface TrainMessage {
    id:           'string';
    externalId:   'string';
    head:         'string';
    text:         'string';
    lead:         'string';
    routeIdxFrom: number;
    routeIdxTo:   number;
    type:         'MAINTENANCE' | 'DISRUPTION';
    startDate:    'string';
    endDate:      'string';
    startTime:    'string';
    endTime:      'string';
}

export interface TrainStation {
    mediumName: string;
    uicCode:    string;
}

export interface TrainDeparture {
    actualDateTime?:        string;
    actualTimeZoneOffset?:  number;
    actualTrack?:           string;
    cancelled?:             boolean;
    departureStatus?:       'ON_STATION' | 'INCOMING' | 'DEPARTED' | 'UNKNOWN';
    direction?:             string;
    messages?:              TrainMessage[];
    name?:                  string;
    plannedDateTime?:       string;
    plannedTimeZoneOffset?: number;
    plannedTrack?:          string;
    product?: {
        categoryCode?:      string;
        longCategoryName?:  string;
        // eslint-disable-next-line id-blacklist
        number?:            string;
        operatorCode?:      string;
        operatorName?:      string;
        shortCategoryName?: string;
        type?:              'TRAIN';
    };
    routeStations?: TrainStation[];
    trainCategory?: 'SPR';
}
