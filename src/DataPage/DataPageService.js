export class DataPageService {
    static fetchData = () =>
        fetch("api/tablesData", {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

    static fetchColumns = id => fetch(`api/${id}/columns`, {
        method: "GET"
    });

    static fetchGraphData = graphType => fetch(`api/graphData`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: graphType
        })
    });

    static updateData = (pointsQuantity, actorsQuantity, maxValue, graphType) =>
        fetch(`api/update`,
            {
                method: "PUT",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pointsQuantity,
                    actorsQuantity,
                    maxValue,
                    graphType
                })
            })
}
