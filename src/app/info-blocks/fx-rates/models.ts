export interface RawEcbFxResponse {
    'gesmes:Envelope': RawFxEnvelope;
}

export interface RawFxEnvelope {
    Cube: RawFxRootCube;
}

export interface RawFxRootCube {
    Cube: RawFxDateCube[];
}

export interface RawFxDateCube {
    attr: {
        time: string;
    };
    Cube: RawFxRateCube[];
}

export interface RawFxRateCube {
    attr: {
        currency: string;
        rate: string;
    }
}

export interface FxRate {
    readonly currency: string;
    readonly rate:     number;
    readonly move:     number;
    readonly symbol:   string;
}
