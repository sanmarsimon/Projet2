import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { ELEMENT_NOT_FOUNDED } from '@app/constant';
import { PlayerService } from '@app/services/player.service';

@Injectable({
    providedIn: 'root',
})
export class ChevaletService {
    letters: Letter[];
    previousButton = '';
    buttonPressed = '';
    multipleOccurrenceIndex: number = 0;
    selectedLetterIndex: number;
    occurrenceIndexes: number[];
    mousePosition: Vec2 = { x: 0, y: 0 };

    constructor(private playerService: PlayerService) {}

    onKeyDown(event: KeyboardEvent) {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
            this.buttonPressed = event.key.toUpperCase();
            this.findOccurrences(this.buttonPressed);
            this.selectLetter();
            this.previousButton = this.buttonPressed;
        } else {
            if (this.selectedLetterIndex !== ELEMENT_NOT_FOUNDED) {
                this.handleKeydown(event);
            }
        }
    }

    onClick(index: number) {
        this.selectedLetterIndex = index;
        this.buttonPressed = this.playerService.letters[index].letter;
    }

    onWheel(event: WheelEvent) {
        if (this.selectedLetterIndex !== ELEMENT_NOT_FOUNDED) {
            if (event.deltaY > 0) {
                this.shiftLeft();
            } else this.shiftRight();
        }
    }

    handleKeydown(event: KeyboardEvent) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        switch (event.key) {
            case 'ArrowLeft':
                // shift left the selected letter  for "left arrow" key press.
                this.shiftLeft();
                break;
            case 'ArrowRight':
                // shift right the selected letter for "right arrow" key press.
                this.shiftRight();
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
        // Cancel the default action to avoid it being handled twice
        // event.preventDefault();
    }

    findOccurrences(keyPressed: string) {
        if (this.previousButton !== this.buttonPressed) {
            this.occurrenceIndexes = [];
            this.multipleOccurrenceIndex = 0;
            for (let i = 0; i < this.playerService.letters.length; i++) {
                if (this.playerService.letters[i].letter === keyPressed) {
                    this.occurrenceIndexes.push(i);
                }
            }
        }
    }

    selectLetter() {
        const occurrence = this.occurrenceIndexes.length;
        if (occurrence === 1) {
            this.selectedLetterIndex = this.occurrenceIndexes[0];
        } else if (occurrence > 1) {
            this.selectedLetterIndex = this.occurrenceIndexes[this.multipleOccurrenceIndex];
            this.multipleOccurrenceIndex = (this.multipleOccurrenceIndex + 1) % occurrence;
        } else this.selectedLetterIndex = -1;
    }

    shiftRight() {
        if (this.selectedLetterIndex === this.playerService.letters.length - 1) {
            this.arrayRotate(this.playerService.letters, true);
        } else {
            const temp = this.playerService.letters[(this.selectedLetterIndex + 1) % this.playerService.letters.length];
            this.playerService.letters[(this.selectedLetterIndex + 1) % this.playerService.letters.length] =
                this.playerService.letters[this.selectedLetterIndex];
            this.playerService.letters[this.selectedLetterIndex] = temp;
        }

        this.selectedLetterIndex = (this.selectedLetterIndex + 1) % this.playerService.letters.length;
    }

    shiftLeft() {
        if (this.selectedLetterIndex === 0) {
            this.arrayRotate(this.playerService.letters, false);
            this.selectedLetterIndex = this.playerService.letters.length - 1;
        } else {
            const temp = this.playerService.letters[this.selectedLetterIndex - 1];
            this.playerService.letters[this.selectedLetterIndex - 1] = this.playerService.letters[this.selectedLetterIndex];
            this.playerService.letters[this.selectedLetterIndex] = temp;
            this.selectedLetterIndex--;
        }
    }

    arrayRotate(array: unknown[], reverse: boolean) {
        if (reverse) array.unshift(array.pop());
        else array.push(array.shift());
        return array;
    }

    color(index: number) {
        if (this.selectedLetterIndex === index) return 'red';
        else return;
    }
}
