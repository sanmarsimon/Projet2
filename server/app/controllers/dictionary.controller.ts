import { HHTP_SUCCESSFUL_REQUEST, HTTP_STATUS_CREATED } from '@app/constants/constant';
import { DictionaryService } from '@app/services/dictionary.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class DictionaryController {
    router: Router;

    constructor(private readonly dictionaryService: DictionaryService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', (req: Request, res: Response) => {
            const dict = { title: req.body.title, description: req.body.description, words: req.body.words };
            this.dictionaryService.add(dict);
            res.status(HTTP_STATUS_CREATED).json({ message: 'Dictionnaire enregistré !' });
        });

        this.router.put('/:id', (req: Request, res: Response) => {
            const index: number = +req.params.id;
            const title = req.body.title;
            const desc = req.body.description;
            this.dictionaryService.modify(index, title, desc);
            // .then(() => {
            //     res.status(HHTP_SUCCESSFUL_REQUEST).json({ message: 'Dictionnaire modifié !' });
            // })
            // .catch((error) => {
            //     res.status(HTTP_BAD_REQUEST).json({ error });
            // });
            res.status(HHTP_SUCCESSFUL_REQUEST).json({ message: 'Dictionnaire modifié !' });
        });

        this.router.delete('/:id', (req: Request, res: Response) => {
            const index: number = +req.params.id;
            this.dictionaryService.delete(index);
            // .then(() => {
            //     const dictionaries = this.dictionaryService.dictionaries;
            //     res.status(HHTP_SUCCESSFUL_REQUEST).json({ message: 'Dictionnaire supprimé !' });
            //     res.json(dictionaries);
            // })
            // .catch((error) => {
            //     res.status(HTTP_BAD_REQUEST).json({ error });
            // });
            res.status(HHTP_SUCCESSFUL_REQUEST).json({ message: 'Dictionnaire supprimé !' });
        });

        this.router.get('/', async (req: Request, res: Response) => {
            // Send the request to the service and send the response
            const dictionaries = this.dictionaryService.dictionaries;
            res.json(dictionaries);
        });
    }
}
