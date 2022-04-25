export default {
    targets: [
        {
            id: 0,
            description: 'Placer un mot qui donne 35 de score',
            points: 10,
            totalOccurencesToComplete: 1,
        },
        {
            id: 1,
            description: 'Placer un mot qui contient au moins 4 voyelles',
            points: 35,
            totalOccurencesToComplete: 1,
        },
        {
            id: 2,
            description: 'Placer un mot qui contient 2 bonus double (X2)',
            points: 20,
            totalOccurencesToComplete: 1,
        },
        {
            id: 3,
            description: 'Placer un mot dans la même direction pendant 3 tours consécutifs',
            points: 40,
            totalOccurencesToComplete: 3,
        },
        {
            id: 4,
            description: 'Placer un mot qui contient 2 fois la même lettre',
            points: 40,
            totalOccurencesToComplete: 1,
        },
        {
            id: 5,
            description: 'Placer un palindrome',
            points: 40,
            totalOccurencesToComplete: 1,
        },
        {
            id: 6,
            description: 'Placer un mot de plus de 5 lettres',
            points: 30,
            totalOccurencesToComplete: 1,
        },
        {
            id: 7,
            description: 'Placer un mot contenant la lettre Y',
            points: 55,
            totalOccurencesToComplete: 1,
        },
    ],
};
