/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable prettier/prettier */
import { TestBed } from '@angular/core/testing';
import { Target } from '@app/classes/target';
import { TargetValidationService } from './target-validation.service';
import { WordAction } from './word-action-solo.service';


describe('TargetValidationService', () => {
  let service: TargetValidationService;
  let wordActionSpy: jasmine.SpyObj<WordAction>;


  beforeEach(() => {
    wordActionSpy = jasmine.createSpyObj('WordAction', ['calculateScore']);

    TestBed.configureTestingModule({
      providers: [
        { provide: WordAction, useValue: wordActionSpy },
      ],
    });
    service = TestBed.inject(TargetValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  /// ////////////////////////////////////// checkIfSameLetterOccurTwice /////////////////////////////
  it('should checkIfSameLetterOccurTwice', () => {
    const word = 'allo';
    const result = service.checkIfSameLetterOccurTwice(word);
    expect(result).toBeTrue();
  });

  it('should checkIfSameLetterOccurTwice', () => {
    const word = '';
    const result = service.checkIfSameLetterOccurTwice(word);
    expect(result).toBeFalse();
  });

  /// ////////////////////////////////////// isPalindrome /////////////////////////////
  it('should return false when its not a palindrome', () => {
    const word = 'allo';
    const result = service.isPalindrome(word);
    expect(result).toBeFalse();
  });

  it('should return true  when its  a palindrome', () => {
    const word = 'aa';
    const result = service.isPalindrome(word);
    expect(result).toBeTrue();
  });

  /// ////////////////////////////////////// checkFourVowels /////////////////////////////
  it('should return false  when its not detected vowels', () => {
    const word = 'ao';
    const result = service.checkFourVowels(word);
    expect(result).toBeFalse();
  });

  it('should return true  when its detected vowels', () => {
    const word = 'aoao';
    const result = service.checkFourVowels(word);
    expect(result).toBeTrue();
  });
  /// ////////////////////////////////////// checkConsecutiveDirection /////////////////////////////
  it('should return true  when its detected 3 times the same direction', () => {
    const word = '!placer a2v h ici';
    service.positionQueue.totalInRow = 0;
    service.positionQueue.lastDirection = 'h';
    const result = service.checkConsecutiveDirection(word);
    expect(result).toBeFalse();
  });

  it('should increment totalInRow  when its not the command !placer', () => {
    const word = '!echanger a2v h ici';
    service.positionQueue.totalInRow = 1;
    service.positionQueue.lastDirection = 'h';
    service.checkConsecutiveDirection(word);
    expect(service.positionQueue.totalInRow).toEqual(service.positionQueue.totalInRow);
  });

  /// ////////////////////////////////////// checkScoreThresholdObjective /////////////////////////////
  it('should return true  when its checkScoreThresholdObjective', () => {
    const word = 'te';
    const command = '!placer a2v te ici';
    wordActionSpy.calculateScore(word, 5, 2, 'h', false);
    const result = service.checkScoreThresholdObjective(word, command);
    expect(result).toBeFalse();
  });

  /// ////////////////////////////////////// checkContainsDoubleBonus /////////////////////////////
  it('should return false  when its not ContainsDoubleBonus', () => {
    const word = 'hier';
    const command = '!placer a2v hier ici';
    const result = service.checkContainsDoubleBonus(word, command);
    expect(result).toBeFalse();
  });

  /// ////////////////////////////////////// checkTargetCompletion /////////////////////////////
  it('should return checkScoreThresholdObjective  when its the first case -> target.id=0', () => {
    const target = new Target(0, 'desc', 5.10, 10);
    const command = '!placer a2v hier ici';
    const word = 'te';
    const result = service.checkTargetCompletion(target, command);
    expect(result).toBe(service.checkScoreThresholdObjective(word, command));
  });

  it('should return checkFourVowels  when its the  case -> target.id=1', () => {
    const target = new Target(1, 'desc', 5.10, 10);
    const command = '!placer a2v hier ici';
    const word = 'te';
    const result = service.checkTargetCompletion(target, command);
    expect(result).toBe(service.checkFourVowels(word));
  });

  it('should return checkContainsDoubleBonus  when its the  case -> target.id=2', () => {
    const target = new Target(2, 'desc', 5.10, 10);
    const command = '!placer a2v hier ici';
    const word = 'te';
    const result = service.checkTargetCompletion(target, command);
    expect(result).toBe(service.checkContainsDoubleBonus(word, command));
  });

  it('should return checkConsecutiveDirection  when its the  case -> target.id=3', () => {
    const target = new Target(3, 'desc', 5.10, 10);
    const command = '!placer a2v hier ici';
    const result = service.checkTargetCompletion(target, command);
    expect(result).toBe(service.checkConsecutiveDirection(command));
  });

  it('should return checkIfSameLetterOccurTwice  when its the  case -> target.id=4', () => {
    const target = new Target(4, 'desc', 5.10, 10);
    const command = '!placer a2v hier ici';
    const word = 'te';
    const result = service.checkTargetCompletion(target, command);
    expect(result).toBe(service.checkIfSameLetterOccurTwice(word));
  });

  it('should return isPalindrome  when its the  case -> target.id=5', () => {
    const target = new Target(5, 'desc', 5.10, 10);
    const command = '!placer a2v hier ici';
    const word = 'te';
    const result = service.checkTargetCompletion(target, command);
    expect(result).toBe(service.isPalindrome(word));
  });

  it('should return isPalindrome  when its the  case -> target.id=6', () => {
    const target = new Target(6, 'desc', 5.10, 10);
    const command = '!placer a2v dormant ici';
    // const word = 'dormant';
    const result = service.checkTargetCompletion(target, command);
    expect(result).toBeTrue();
  });
  it('should return isPalindrome  when its the  case -> target.id=7', () => {
    const target = new Target(7, 'desc', 5.10, 10);
    const command = '!placer a2v yellow ici';

    const result = service.checkTargetCompletion(target, command);
    expect(result).toBeTrue();
  });

  it('should return isPalindrome  when its the  case -> default', () => {
    const target = new Target(10, 'desc', 5.10, 10);
    const command = '!placer a2v yellow ici';

    const result = service.checkTargetCompletion(target, command);
    expect(result).toBeFalse();
  });

});
