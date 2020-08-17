"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseDataByRank(data) {
    data.columnNames.map((column, index) => {
        const values = data.data.map(item => item.values[index]);
        values.sort((a, b) => a < b ? 1 : -1);
        data.data.forEach(item => {
            item.values[index] = values.indexOf(item.values[index]) + 1;
        });
    });
}
exports.parseDataByRank = parseDataByRank;
