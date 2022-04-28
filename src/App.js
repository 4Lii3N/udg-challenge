import './App.css';
import Papa from 'papaparse';
import React, { useState } from "react";
import $ from 'jquery';

function App() {
    //store data
    const [parsedData, setParsedData] = useState([]);
    //store column name
    const [tableRows, setTableRows] = useState([]);
    //store values
    const [values, setValues] = useState([]);
    const changeHandler = (event) => {
        // parse file data using PapaParse
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const rowsArray = [];
                const valuesArray = [];
                // get name and values
                results.data.map((d) => {
                    rowsArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
                });
                // conv to array
                setParsedData(results.data);

                setTableRows(rowsArray[0]);

                setValues(valuesArray);
            },
        });
    };

    return (
        <div className="mainContent text-white">
            <input
                type="file"
                onChange={changeHandler}
                accept=".csv"
                style={{ display: "block", margin: "10px auto"}}
            />
            <div class="tableFixHead">
                <table class="csvTable">
                    <thead>
                        <tr>
                            {tableRows.map((rows, index) => {
                                return <th key={index}>{rows}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody contentEditable={"true"}>
                        {values.map((value, index) => {
                            return (
                                <tr key={index}>
                                    {value.map((val, i) => {
                                        return <td key={i}>{val}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div class="bottom-buttons">
                <button className="addRow btn btn-dark btn-lg">Add table row</button>
                <button className="btn btn-dark btn-lg" onClick={() => exportToCSV()}>Export To CSV</button>
            </div>
        </div>
    );
}



function makeDownload(csv, filename) {
    var csvFile;
    var downloadLink;
    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});
    // Download link
    downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // Create link
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // remove link visibility
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    // Click download link
    downloadLink.click();
}

function exportToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);
        csv.push(row.join(","));
    }
    // Download CSV file
    makeDownload(csv.join("\n"), filename);
    console.log(csv);
}

$(function(){
    $('button.addRow').click(function(event){
        event.preventDefault();
        var newRow = $('<tr><td>New row</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
        $('table.csvTable').append(newRow);
    });
});

export default App;