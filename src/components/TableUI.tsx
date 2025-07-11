import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

type Props = {
  labels: string[];
  values1: number[];
  values2: number[];
};

function combineArrays(arrLabels: string[], arrValues1: number[], arrValues2: number[]) {
  return arrLabels.map((label, index) => ({
    id: index,
    label,
    value1: arrValues1[index],
    value2: arrValues2[index],
  }));
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'label', headerName: 'Hora', width: 150 },
  { field: 'value1', headerName: 'Temperatura', width: 150 },
  { field: 'value2', headerName: 'Viento', width: 150 },
  {
    field: 'resumen',
    headerName: 'Resumen',
    description: 'Resumen combinando los valores',
    sortable: false,
    hideable: false,
    width: 200,
    valueGetter: (_, row) => `${row.label} ${row.value1} ${row.value2}`,
  },
];

export default function TableUI({ labels, values1, values2 }: Props) {
  const rows = combineArrays(labels, values1, values2);

  return (
    <Box sx={{ height: 350, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
