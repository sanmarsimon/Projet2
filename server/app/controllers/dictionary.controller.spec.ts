/* eslint-disable prettier/prettier */
import { Application } from '@app/app';
import { DictionaryService } from '@app/services/dictionary.service';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { Container } from 'typedi';


describe('DictionaryController', () => {
    let dictionaryService: SinonStubbedInstance<DictionaryService>;

    beforeEach(async () => {
        dictionaryService = createStubInstance(DictionaryService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['dictionaryController'], 'dictionaryService', { value: dictionaryService, writable: true });
    });


});
