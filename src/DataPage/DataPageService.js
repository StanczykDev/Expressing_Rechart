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

    static fetchGraphData = () => fetch(`api/graphData`, {
        method: "GET"
    });

    static updateData = (pointsQuantity, actorsQuantity, maxValue) =>
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
                    maxValue
                })
            })
}
