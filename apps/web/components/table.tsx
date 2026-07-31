import type { DocsTable } from "../content";

/*
 * Wide reference tables scroll on their own rather than pushing the page
 * sideways, and the first cell of each row is a heading for that row.
 *
 * Rows are keyed by position rather than by their first cell: a comparison
 * table names the same content twice, once per column it is compared across.
 */
export function Table({ table }: { table: DocsTable }) {
  return (
    <div className="docs-table">
      <table>
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={index}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
