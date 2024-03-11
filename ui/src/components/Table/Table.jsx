import React, { useEffect, useState, useDeferredValue, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community';
import { InputGroup, Button, Form, Row, Col } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './Table.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Table = ({ columns, tableData, width, reports, startDate, endDate, ledger, setEndDate, setStartDate, defaultColDef, onRowClicked, showExportbtn, createEntry, showCreatebtn, loading }) => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [search, setSearch] = useState('');

    const gridRef = useRef();

    const defferedSearch = useDeferredValue(search);

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };
    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);

    let exportColumns;
    exportColumns = columns?.map((col) => ({ title: col.headerName, dataKey: col.field }));

    useEffect(() => {
        gridApi?.setQuickFilter(defferedSearch);
        const isDataEmpty = gridApi && gridApi?.getModel()?.getRowCount() === 0;
        if (isDataEmpty) {
            gridApi?.showNoRowsOverlay();
        } else {
            gridApi?.hideOverlay();
        }
    }, [defferedSearch, gridApi]);

    useEffect(() => {
        if (gridColumnApi) {
            gridColumnApi.setColumnPinned();
        }
        exportColumns = columns.map((col) => ({ title: col.headerName, dataKey: col.field }));
    }, [gridColumnApi, search]);

    const onFilterTextChange = (event) => {
        setSearch(event.target.value);
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(
                    exportColumns,
                    tableData?.filter((item) => Object.values(item)?.some((field) => String(field)?.toLowerCase()?.includes(search.toLowerCase())))
                );

                doc.save('products.pdf');
            });
        });
    };

    const gridOptions = {
        domLayout: 'autoHeight',
        suppressAutoSize: true,
        suppressColumnVirtualisation: false,
        suppressPaginationPanel: false,
        overlayLoadingTemplate: Loading,
        embedFullWidthRows: true,
        autoHeight: true,
        suppressRowTransform: true,
        overlayNoRowsTemplate: '<span>No data found</span>'
    };

    return (
        <div className="ag-theme-alpine custom-table" style={{ height: '100%', width: '100%' }}>
            <div style={{ marginBottom: '10px' }} className="d-flex justify-content-between" id={reports && 'repports'}>
                <div className="d-flex reports-grid">
                    <InputGroup>
                        <Form.Control className="search-input" type="text" name="Search" label="Search" onChange={onFilterTextChange} placeholder="Search..." />
                        <InputGroup.Text>
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                    </InputGroup>
                </div>
                <div className="d-flex reports-section">
                    {showCreatebtn && (
                        <Button className="me-1" onClick={createEntry}>
                            Create
                        </Button>
                    )}
                    {showExportbtn && (
                        <div className={reports && 'position-relative'}>
                            <div className="d-flex exports-btns">
                                {ledger && ledger ? (
                                    ''
                                ) : (
                                    <Button className="me-1" onClick={onBtnExport}>
                                        CSV
                                    </Button>
                                )}
                                <Button onClick={exportPdf}>PDF</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {reports && (
                <>
                    <Row className="entryForm m-0 my-2">
                        <Col sm={12} md={6} className="p-0">
                            <Form.Label className="mb-0">Start Date</Form.Label>
                            <Form.Control type="date" className="mt-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </Col>
                        <Col sm={12} md={6} className="p-0 ps-md-3">
                            <Form.Label className="mb-0">End Date</Form.Label>
                            <Form.Control type="date" className="mt-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </Col>
                    </Row>
                </>
            )}

            <div className="ag-theme-alpine" style={{ width: width ? width : '100%' }}>
                {loading ? (
                    <Loading />
                ) : (
                    <AgGridReact
                        ref={gridRef}
                        gridOptions={gridOptions}
                        columnDefs={columns}
                        rowData={tableData} // Concatenate empty rows
                        animateRows={true}
                        rowSelection="multiple"
                        sizeRowsToFit
                        onGridReady={onGridReady}
                        loadingOverlayComponent={Loading}
                        onRowClicked={onRowClicked}
                        suppressMenuHide={true}
                        floatingFilter={true}
                        pagination={true}
                        paginationPageSize={50}
                        defaultColDef={defaultColDef}
                        rowClass="data-table-row"
                        headerClass="data-table-header"
                        suppressCellFocus={true}
                        suppressSizeToFit={true}
                        groupSelectsChildren={true}
                        suppressAggFuncInHeader={true}
                    />
                )}
            </div>
        </div>
    );
};

export default Table;
