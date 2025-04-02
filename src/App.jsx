import { useState } from 'react'
import FileUpload from './components/FileUpload'
import './App.css'

function App() {
const [transactions,setTransactions]=useState([]);

return(
<>
<div style={{ padding: "20px" }}>
      <h2>Personal Expense Tracker</h2>
      <FileUpload onDataParsed={setTransactions} />

      {transactions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Parsed Transactions</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                {Object.keys(transactions[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  {Object.values(tx).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
</>
);
}
export default App
