export class Target {
    id: number; // The id of the target from 0 to 7 (unique)
    description: string;
    points: number;
    totalOccurencesToComplete: number;
    completion: number = 0;
    constructor(id: number, description: string, points: number, totalOccurencesToComplete: number) {
        this.id = id;
        this.description = description;
        this.points = points;
        this.totalOccurencesToComplete = totalOccurencesToComplete;
    }
}
