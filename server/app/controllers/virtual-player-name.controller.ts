import { ELEMENT_NOT_FOUNDED, HHTP_SUCCESSFUL_REQUEST, HTTP_STATUS_CREATED } from '@app/constants/constant';
import { DatabaseService } from '@app/services/database.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class VirtualPlayerNameController {
    router: Router;

    advancedPlayername: string[] = ['James', 'Sanmar', 'Marc'];
    beginnerPlayerName: string[] = ['Simon', 'Jack', 'Ali'];

    constructor(private database: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();

        this.router.post('/', (req: Request, res: Response) => {
            this.database.addNewVirtualPlayerName(req.body.name, req.body.category);
            res.status(HTTP_STATUS_CREATED).json({ message: 'Nom enregistré !' });
        });

        this.router.put('/:id', (req: Request, res: Response) => {
            const name = req.params.id;
            this.database.modifyVirtualPlayerName(req.body.newName, name, req.body.category);
            res.status(HHTP_SUCCESSFUL_REQUEST).json({ message: 'Element modifié !' });
        });

        this.router.delete('/:id', (req: Request, res: Response) => {
            const index = this.advancedPlayername.indexOf(req.body, 0);
            if (index > ELEMENT_NOT_FOUNDED) {
                this.advancedPlayername.splice(index, 1);
            } else this.beginnerPlayerName.splice(index, 1);

            res.status(HHTP_SUCCESSFUL_REQUEST).json({ message: 'Element supprimé !' });
        });

        this.router.get('/advanced', async (req: Request, res: Response) => {
            res.json(this.advancedPlayername);
        });

        this.router.get('/beginner', async (req: Request, res: Response) => {
            res.json(this.advancedPlayername);
        });
    }
}
