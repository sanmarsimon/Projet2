import { WordDictionnary } from '@app/classes/word-dictionnary-sv';
import { faux, VERIFWORD, vrai } from '@app/constants/constant';
import { Dict } from '@app/interfaces/dict';
import * as fs from 'fs';
import { Service } from 'typedi';
@Service()
export class WordValidationService {
    dictionary: Dict;
    checkWordExistence(word: string, dictName: string): string {
        const dir = './app/assets/';
        if (dictName === undefined || dictName === '') {
            dictName = 'Mon dictionnaire';
        }
        const path = dictName === 'Mon dictionnaire' ? dir + 'dictionnary.json' : dir + dictName + '.json';
        const data = fs.readFileSync(path, 'utf8');
        const myData: WordDictionnary = JSON.parse(data);
        if (VERIFWORD !== myData.words.findIndex((element) => word === element)) {
            return vrai;
        } else {
            return faux;
        }
    }
}
