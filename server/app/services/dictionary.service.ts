import { Dict } from '@app/interfaces/dict';
import * as fs from 'fs';
import { Service } from 'typedi';

// const fs = require('fs');
const dir = './app/assets/';

@Service()
export class DictionaryService {
    dictList: Dict[] = [];

    constructor() {
        this.fileList();
    }

    get dictionaries(): Dict[] {
        return this.dictList;
    }

    fileList() {
        fs.readdir(dir, (err: unknown, files: unknown[]) => {
            files.forEach((file) => {
                const content = JSON.parse(fs.readFileSync(dir + file, 'utf8'));
                // const dict = new Dict(content.title, content.description, []);
                const dict = { title: content.title, description: content.description, words: [] };
                this.dictList.push(dict);
            });
        });
    }

    add(dict: Dict) {
        const data = JSON.stringify(dict);
        // store the dictionary in local folder
        fs.writeFile(dir + dict.title + '.json', data, (err: unknown) => {
            if (err) throw err;
        });
        dict.words = [];
        this.dictList.push(dict);
    }

    async modify(index: number, title: string, desc: string) {
        return new Promise(() => {
            const fileName = this.dictList[index].title;
            this.dictList[index].title = title;
            this.dictList[index].description = desc;
            this.modifyFile(index, fileName);
        });
    }

    async modifyFile(index: number, fileName: string) {
        return new Promise((resolve, reject) => {
            const path = dir + fileName + '.json';
            const content = JSON.parse(fs.readFileSync(path, 'utf8'));
            const title = this.dictList[index].title;
            content.title = title;
            content.description = this.dictList[index].description;
            const newPath = dir + title + '.json';
            fs.writeFileSync(newPath, JSON.stringify(content));
            fs.unlink(path, (error: unknown) => {
                if (error) {
                    reject(error);
                    throw error;
                }
            });
        });
    }

    async delete(index: number) {
        return new Promise(() => {
            this.deleteFile(this.dictList[index].title);
            this.dictList.splice(index, 1);
        });
    }

    deleteFile(fileName: string) {
        const path = dir + fileName + '.json';
        fs.unlink(path, (err: unknown) => {
            if (err) throw err;
        });
    }

    checkDictExistence(name: string) {
        for (const dict of this.dictList) if (dict.title === name) return true;
        return false;
    }
}
