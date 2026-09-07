const purchases = [
    {
        id: 1,
        reference: "PUR-2026-001",
        supplier: "Crown Paints Kenya",
        date: "2026-08-01",
        items: 12,
        total: 85000,
        paid: 85000,
        balance: 0,
        status: "Paid"
    },
    {
        id: 2,
        reference: "PUR-2026-002",
        supplier: "Bamburi Cement",
        date: "2026-08-02",
        items: 25,
        total: 145000,
        paid: 100000,
        balance: 45000,
        status: "Partial"
    },
    {
        id: 3,
        reference: "PUR-2026-003",
        supplier: "Davis & Shirtliff",
        date: "2026-08-03",
        items: 8,
        total: 62000,
        paid: 62000,
        balance: 0,
        status: "Paid"
    },
    {
        id: 4,
        reference: "PUR-2026-004",
        supplier: "Kenya Pipe Manufacturers",
        date: "2026-08-04",
        items: 15,
        total: 92000,
        paid: 0,
        balance: 92000,
        status: "Pending"
    }
];

export default purchases;