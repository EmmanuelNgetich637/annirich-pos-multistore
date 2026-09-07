import TableHeader from "./TableHeader";
import Pagination from "./Pagination";

function DataTable({
    columns,
    children
}) {
    return (
        <div className="table-card">

            <table className="data-table">

                <TableHeader
                    columns={columns}
                />

                <tbody>

                    {children}

                </tbody>

            </table>

            <Pagination />

        </div>
    );
}

export default DataTable;