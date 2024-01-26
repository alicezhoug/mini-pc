import axios from 'axios';

export interface Table {
  tableName: string;
  createTime: string;
  engine: string;
  tableCollation: string;
  tableComment: string;
}

export interface TableCol {
  columnId: number;
  tableName: string;
  columnName: string;
  columnType: string;
  dictName: string;
  extra: string;
  fromShow: number;
  keyType: string;
  listShow: number;
  notNull: number;
  queryType: string;
  remark: string;
  dateAnnotation: string;
}

// eslint-disable-next-line import/prefer-default-export
export function getTableCols(tableName: string) {
  return axios.get(`/tools/generate/table/columns?tableName=${tableName}`);
}
// 返回所有Table信息
export function getAllTables() {
  return axios.get(`/tools/generate/table?currentPage=1&pageSize=9999`);
}

