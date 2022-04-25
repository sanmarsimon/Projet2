export const DEFAULT_WIDTH = 640;
export const DEFAULT_HEIGHT = 640;
export const BOX_SIDE = 40;
export const CASE_NUMBER = 16;

export const CLASSIC_RULES = 'classic';
export const LOG2990_RULES = 'log2990';

export const MOON_PINK_COLOR = 'rgb(232,211,211)';
export const BROWN_COLOR = 'rgba(48,72,108,0.8)';
export const COORD_X_FILLRECT = 40;
export const COORD_Y_FILLRECT = 40;
export const FILLRECT_WIDTH = 40;
export const FILLRECT_HEIGHT = 40;
export const CHERRY_ROSE = 'rgb(224,126,126)';
export const AXE_Y_FOR_MOT = 620;
export const AXE_Y_FOR_X = 630;
export const BASE_DIX = 10;

export const ASCI_E_ACCENT_MIN = 232;
export const ASCI_E_ACCENT_MAX = 235;

export const ASCI_A_ACCENT_MIN = 224;
export const ASCI_A_ACCENT_MAX = 229;

export const ASCI_C_ACCENT = 231;
export const ASCI_U_ACCENT_MIN = 249;
export const ASCI_U_ACCENT_MAX = 252;

export const ASCI_A = 'a'.charCodeAt(0);
export const ASCI_O = 'o'.charCodeAt(0);
export const ASCI_Z = 'z'.charCodeAt(0);
export const MAX_LENGTH_LINE = 15;
export const QUATRE = 4;
export const MAX_LETTERS = 7;
export const SEVEN_CASES = BOX_SIDE * MAX_LETTERS;
export const LAST_CASE = SEVEN_CASES * 2;
export const AXE_X_FOR_WORD_MOT = 50;
export const AXE_X_FOR_WORD_X = 55;
export const AXE_Y_FOR_WORD_MOT = 60;
export const AXE_Y_FOR_WORD_X = 70;
export const ARG_FOR_TIME_OUT = 3000;
export const FOUR = 4;
export const CANVAS_SIDE = 6;
export const EXCHANGE_LETTER = 6;
export const AXE_FOR_X = 5;
export const FOUR_CASES = BOX_SIDE * FOUR;
export const FIVE_CASES = BOX_SIDE * AXE_FOR_X;
export const INCREMENTATION = 8;
export const DOUBLE_WORD_CASE = 10;
export const DOUBLE_WORD_BOX = 11;
export const MAX_WIDTH = 35;
export const TARGET_DOUBLE_LETTER = 600;
export const HEXA = 12;
export const GRIDSERVICE = 9;
export const MAX_SIDES = 580;
export const MAX_LENGTH_COMMAND = 4;
export const FOR_VERIFY_BOXES = 97;

export const NAME_MIN_LENGTH = 5;
export const NAME_MAX_LENGTH = 15;
export const NAME_MAX_LENGTH_MINUS = 14;

export const OPPONENT_NAMES: string[] = ['sanmarsimon', 'Maiva', 'Aligator'];

export const SIZE_Y_MATRIX = 15;
export const SIZE_X_MATRIX = 15;
export const SIZE_FOR_BONUS_POINTS = 7;
export const BONUS_7_LETTERS = 50;
export const PROBA_PASS_ROUND = 0.1;
export const PROBA_EXCHANGE_LETTER = 0.2;
export const PROBA_LETTER_PLACEMENT_MIDDLE = 0.3;
export const PROBA_LETTER_PLACEMENT_MIN = 0.4;
export const SCORE_PROBA_FIRST_MIN = 7;
export const SCORE_PROBA_FIRST_MAX = 12;
export const SCORE_PROBA_SECOND_MIN = 13;
export const SCORE_PROBA_SECOND_MAX = 18;
export const SCORE_PROBA_MIN = 6;
export const INCREMENTATION_SCORE = -1;
export const SET_INTERVAL = 100;

export const HHTP_SUCCESSFUL_REQUEST = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_BAD_REQUEST = 400;

export const MAX_TIMER_COUNT = 60;
export const TIMER_INTERVAL = 1000;
export const MAX_NUMBER_LETTER = 7;

export const MOUSE_SCROLL_SENSITIVITY = 0.005;
export const MAX_ZOOM = 5;
export const MIN_ZOOM = 0.1;

export const MAX_SKIP_TURN = 6;
export const RANDOM_BOOLEAN_CONST = 0.5;

export const VERIFWORD = -1;
export const VALEURDOUBLEMOT = 4;
export const VALEURTRIPLEMOT = 6;
export const ELEMENT_NOT_FOUNDED = -1;

export const LETTERS_STOCK_MAX_LENGTH = 102;
export const vrai = '1';
export const faux = '0';

export const boardTracker: string[][] = [
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
];

export const matrixOfBonusPoints: number[][] = [
    [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, VALEURTRIPLEMOT, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
    [1, VALEURDOUBLEMOT, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, VALEURDOUBLEMOT, 1],
    [1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1],
    [2, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 2],
    [1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1],
    [1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1],
    [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
    [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
    [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
    [1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 2, 3, 1, 1],
    [1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 1],
    [2, 1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1, 2],
    [1, 1, VALEURDOUBLEMOT, 1, 1, 1, 2, 1, 2, 1, 1, 1, VALEURDOUBLEMOT, 1, 1],
    [1, VALEURDOUBLEMOT, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, VALEURDOUBLEMOT, 1],
    [VALEURTRIPLEMOT, 1, 1, 2, 1, 1, 1, VALEURTRIPLEMOT, 1, 1, 1, 2, 1, 1, VALEURTRIPLEMOT],
];
