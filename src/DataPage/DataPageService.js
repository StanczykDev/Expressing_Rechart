export class DataPageService {
    static fetchData = (update = false) =>
        fetch("api/tablesData", {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                update
            })
        });

    static fetchColumns = id => fetch(`api/${id}/columns`, {
        method: "GET"
    });

    static fetchGraphData = () => fetch(`api/graphData`, {
        method: "GET"
    });

    static updateData = () => fetch(`api/update`);
}
