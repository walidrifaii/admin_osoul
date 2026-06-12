import React from "react";
type TableProps = {
  rows: { [key: string]: string }[];
  headers: string[];
  title: string;
  actionFun: (userId: string) => void;
  ButtonTit: string;
  color: string;
};
export default function Table({
  rows,
  headers,
  title,
  actionFun,
  ButtonTit,
  color,
}: TableProps) {
  const keys = Object.keys(rows[0] || {});
  const keySet = Array.from(new Set(keys));

  return (
    <div className="flex-1 justify-center items-center flex flex-col p-8">
      <h1 className="text-2xl font-bold mb-4 text-black arabic">{title}</h1>
      <div className="w-full max-w-4xl">
        {/* <div className="mb-6 flex justify-end ">
          <input
            type="text"
            placeholder="...ابحث عن مستخدم"
            className="w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-right arabic"
          />
        </div> */}
        <div className={`table-container`}>
          <div className="tableS">
            <div className="table-header">
              <div className="tableRowHead">
                {headers.map((header, idx) => (
                  <div className="table-cell head" key={idx}>
                    {header}
                  </div>
                ))}
              </div>
              {rows.map((user) => (
                <div className="tableRow" key={user.id}>
                  {keySet.map(
                    (key, idx) =>
                      key !== "id" && (
                        <div key={idx} className="table-cell">
                          {user[key]}
                        </div>
                      )
                  )}
                  <div className="table-cell">
                    <button
                      className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                      onClick={() => actionFun(user.id)}
                      style={{ backgroundColor: color }}
                    >
                      {ButtonTit}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
