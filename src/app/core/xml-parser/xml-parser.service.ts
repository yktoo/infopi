import { Injectable } from '@angular/core';
import * as converter from 'xml-js';

@Injectable({
    providedIn: 'root',
})
export class XmlParserService {

    /**
     * Parse the provided XML string into an object of the given type.
     */
    parse<T>(input: string): T {
        return converter.xml2js(
            input,
            {
                compact:       true,
                textKey:       'text',
                attributesKey: 'attr',
                cdataKey:      'text',
            }) as T;
    }
}
