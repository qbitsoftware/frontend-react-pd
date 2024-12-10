
const TestBracket = () => {
    const sampleData = {
        rounds: [
            {
                name: "1st round"
            }
        ],
        matches: [
            {
                roundIndex: 0,
                order: 0,
                sides: [
                    {
                        contestantId: "163911",
                        scores: [
                            {
                                mainScore: "7",
                                isWinner: true
                            },
                            {
                                mainScore: "6",
                                isWinner: true
                            },
                            {
                                mainScore: "6",
                                isWinner: true
                            }
                        ],
                        isWinner: true
                    },
                    {
                        contestantId: "163806",
                        scores: [
                            {
                                mainScore: "5"
                            },
                            {
                                mainScore: "2"
                            },
                            {
                                mainScore: "2"
                            }
                        ]
                    }
                ]
            },
            {
                roundIndex: 0,
                order: 1,
                sides: [
                    {
                        contestantId: "163913",
                        scores: [
                            {
                                mainScore: "7",
                                isWinner: true
                            },
                            {
                                mainScore: "6",
                                isWinner: true
                            },
                            {
                                mainScore: "6",
                                isWinner: true
                            }
                        ],
                        isWinner: true
                    },
                    {
                        contestantId: "163812",
                        scores: [
                            {
                                mainScore: "5"
                            },
                            {
                                mainScore: "2"
                            },
                            {
                                mainScore: "2"
                            }
                        ]
                    }
                ]
            },
            {
                roundIndex: 1,
                order: 0,
                sides: [
                    {
                        contestantId: "163913",
                        scores: [
                            {
                                mainScore: "7",
                                isWinner: true
                            },
                            {
                                mainScore: "6",
                                isWinner: true
                            },
                            {
                                mainScore: "6",
                                isWinner: true
                            }
                        ],
                        isWinner: true
                    },
                    {
                        contestantId: "163806",
                        scores: [
                            {
                                mainScore: "5"
                            },
                            {
                                mainScore: "2"
                            },
                            {
                                mainScore: "2"
                            }
                        ]
                    }
                ]
            }
        ],
        contestants: {
            163806: {
                entryStatus: "4",
                players: [
                    {
                        title: "D. Medvedev",
                        nationality: "RU"
                    }
                ]
            },
            163911: {
                entryStatus: "1",
                players: [
                    {
                        title: "N. Djokovic",
                        nationality: "RS"
                    }
                ]
            },
            163912: {
                entryStatus: "3",
                players: [
                    {
                        title: "V. Andrus",
                        nationality: "RS"
                    }
                ]
            },
            163913: {
                entryStatus: "6",
                players: [
                    {
                        title: "J. Kivisaar",
                        nationality: "EE"
                    }
                ]
            }
        }
    }
    return (
        <div>
            {/* {sampleData.matches.map((match) => {
                let previousMatchIndex = 0
                if (match.roundIndex != previousMatchIndex) {
                    previousMatchIndex = match.roundIndex
                }
                const topCoord = (match.order * 100) + (previousMatchIndex * 50)
                return (
                    <div >
                        <div className={`absolute top-[${topCoord}px] left-[${previousMatchIndex * 250}px] w-40 h-20 bg-blue-200 rounded-lg flex items-center justify-center`}>
                            {match.roundIndex}

                        </div>

                        <div className={`absolute top-[${topCoord + 40}px] left-[${(previousMatchIndex * 250) + 100}px] h-[2px] w-[50px] bg-black`}></div>
                    </div>

                )
            })} */}
            <div className="absolute top-[100px] left-[100px] w-40 h-20 bg-blue-200 rounded-lg flex items-center justify-center">
                Element 1
            </div>

            <div className="absolute top-[300px] left-[100px] w-40 h-20 bg-green-200 rounded-lg flex items-center justify-center">
                Element 2
            </div>

            <div className="absolute top-[200px] left-[350px] w-40 h-20 bg-red-200 rounded-lg flex items-center justify-center">
                Winner
            </div>

            <div className="absolute top-[140px] left-[260px] w-[40px] h-[2px] bg-black"></div>
            <div className="absolute top-[340px] left-[260px] w-[40px] h-[2px] bg-black"></div>
            <div className="absolute top-[235px] left-[300px] h-[2px] w-[50px] bg-black"></div>
            <div className="absolute top-[140px] left-[300px] h-[200px] w-[2px] bg-black"></div>
        </div>
    );
}

export default TestBracket;