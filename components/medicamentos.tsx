import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// Define o tipo do objeto Medicamento com as propriedades corretas
interface Medicamento {
  Modalidade: string;
  Patologia: string;
  Cobertura: string;
  GRATUIDADE: string;
  'Princípios Ativos/Insumos': string; 
}

function Medicamentos(): React.ReactElement {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false); 

  // Estados para os filtros
  const [filterPatologia, setFilterPatologia] = useState('');
  const [filterPrincípiosAtivos, setFilterPrincípiosAtivos] = useState('');
  const [filterCobertura, setFilterCobertura] = useState('');

  useEffect(() => {
    
    const btnMedicamento = document.getElementById('btn-medicamento');
    if (btnMedicamento) {
      btnMedicamento.addEventListener('click', async () => {
        try {
          // Carrega o arquivo XLSX diretamente da pasta do projeto
          const response = await fetch('remedios.xlsx'); 
          if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo.');
          }

          // Lê o arquivo como um ArrayBuffer
          const workbook = await XLSX.read(await response.arrayBuffer(), { type: 'array' });
          const sheetNames = workbook.SheetNames;
          const worksheet = workbook.Sheets[sheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet);

          // Define o tipo de dados para o array de medicamentos
          setMedicamentos(data as Medicamento[]);

         
        } catch (err: unknown) {
          if (typeof err === 'string') {
            setError(err);
          } 
        }
      });
    }
  }, []);

  // Função para filtrar os medicamentos
  const filteredMedicamentos = medicamentos.filter((medicamento) => {
    return (
      (filterPatologia === '' || medicamento.Patologia.toLowerCase().includes(filterPatologia.toLowerCase())) &&
      (filterPrincípiosAtivos === '' || medicamento['Princípios Ativos/Insumos'].toLowerCase().includes(filterPrincípiosAtivos.toLowerCase())) &&
      (filterCobertura === '' || medicamento.Cobertura.toLowerCase().includes(filterCobertura.toLowerCase()))
    );
  });

  return (
    <div className='buttons'> 
      <button onClick={() => setShowTable(!showTable)} id="btn-medicamento"> 
      {showTable ? 'Fechar tabela de remedios' : 'Abrir tabela de remedios'}</button>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <> {showTable && (
          <div className='display: flex py-3 text-3xl  font-semibold text-center table-responsive'>
          {/* Campos de filtro */}
         
          <div >
            <label htmlFor="filterPatologia">Patologia:</label>
            <input 
              className='rounded-full border-black border-4 text-center'
              type="text" 
              id="filterPatologia" 
              value={filterPatologia} 
              onChange={(e) => setFilterPatologia(e.target.value)} 
            />
          </div>
          <div>
            <label htmlFor="filterPrincípiosAtivos">Princípios Ativos/Insumos:</label>
            <input 
               className='rounded-full border-black border-4 text-center'
              type="text" 
              id="filterPrincípiosAtivos" 
              value={filterPrincípiosAtivos} 
              onChange={(e) => setFilterPrincípiosAtivos(e.target.value)} 
            />
          </div>
          <div>
            <label htmlFor="filterCobertura">Cobertura:</label>
            <input 
               className='rounded-full border-black border-4 text-center'
              type="text" 
              id="filterCobertura" 
              value={filterCobertura} 
              onChange={(e) => setFilterCobertura(e.target.value)} 
            />
          </div>
          </div>
        )}
          {showTable && (
            <table className="border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  <th>Patologia</th>
                  <th>Princípios Ativos/Insumos</th>
                  <th>Cobertura</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicamentos.map((medicamento, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td>{medicamento.Patologia}</td>
                    <td>{medicamento['Princípios Ativos/Insumos']}</td>
                    <td>{medicamento.Cobertura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default Medicamentos;