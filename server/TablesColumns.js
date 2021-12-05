const COLUMNS = {
    VALUES: [
        // {
        //     Header: "ACTOR ID",
        //     accessor: "actorId"
        // }
    ],
    ACTORS: [
        {
            Header: "ACTOR NAME",
            accessor: "actorName"
        },
        {
            Header: "ACTOR COLOR",
            accessor: "actorColor"
        },
        // {
        //     Header: "ACTOR ID",
        //     accessor: "actorId"
        // }
    ]
}

const getPointColumn = index => (
    {
        Header: `POINT ${index}`,
        accessor: `point${index}`
    }
)

const generateColumns = pointsQuantity => {
    const columns = {
        VALUES: [...COLUMNS.VALUES],
        ACTORS: [...COLUMNS.ACTORS]
    };

    for(let i = pointsQuantity; i >= 1; i--) {
        columns.VALUES.unshift(getPointColumn(i));
    }

    return columns;
}

module.exports = {
    COLUMNS,
    generateColumns
}