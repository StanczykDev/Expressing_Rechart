export class DataPageService {
    static fetchData = () =>
        fetch("api/tablesData", {
            method: "GET"
        });

    static fetchColumns = id => fetch(`api/${id}/columns`, {
        method: "GET"
    });
}
