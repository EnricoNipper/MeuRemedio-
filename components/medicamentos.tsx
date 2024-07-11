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
      <div className="p-10  flex justify-center items-center">

<div className="relative inline-flex  group">
    <div
        className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
    </div>
    <button className= 'relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'onClick={() => setShowTable(!showTable)} id="btn-medicamento"> 
      {showTable ? 'Fechar tabela de remedios' : 'Abrir tabela de remedios'}</button>
</div>
</div>
      
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <>
         {showTable && (
          <div className='  text-lg font-bold  p-6 '>
          {/* Campos de filtro */}
         
          <div  className='text-lg font-bold  p-6 ' >
            <label htmlFor="filterPatologia">Patologia:</label>
            <input 
              className='text-black rounded-full border-black border-4 text-center'
              type="text" 
              id="filterPatologia" 
              value={filterPatologia} 
              onChange={(e) => setFilterPatologia(e.target.value)} 
            />
          </div>
          <div className="p-2 ">
            <label htmlFor="filterPrincípiosAtivos">Princípios Ativos:</label>
            <input 
               className='text-black rounded-full border-black border-4 text-center'
              type="text" 
              id="filterPrincípiosAtivos" 
              value={filterPrincípiosAtivos} 
              onChange={(e) => setFilterPrincípiosAtivos(e.target.value)} 
            />
          </div>
          <div className="p-2">
            <label htmlFor="filterCobertura">Cobertura:</label>
            <input 
               className='text-black rounded-full border-black border-4 text-center'
              type="text" 
              id="filterCobertura" 
              value={filterCobertura} 
              onChange={(e) => setFilterCobertura(e.target.value)} 
            />
          </div>
          </div>
        )}
          {showTable && (
            <div className="flex flex-auto">
              <div className="overflow-x-auto ">
                <div className="  basis-1/3 flex-1">
                  <div className="overflow-hidden w-full"> {/* Adicione w-full para controlar a largura */}
                    <table className="border-collapse border border-gray-400 w-full "> {/* Use table-auto para ajustar a largura e min-w-0 para evitar colunas muito pequenas */}
                      <thead className=" border-b">
                        <tr>
                          <th className="text-base font-bold px-1 text-left">Patologia</th>
                          <th className="text-base font-bold px-1 text-left">Princípios Ativos/Insumos</th>
                          <th className="text-base font-bold px-1 text-left">Cobertura</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMedicamentos.map((medicamento, index) => (
                          <tr key={index} className="font-bold border-b">
                            <td className="text-xs font-bold px-1 text-left">{medicamento.Patologia}</td>
                            <td className="text-xs font-bold px-1 text-left">{medicamento['Princípios Ativos/Insumos']}</td>
                            <td className="text-xs font-bold px-1 text-left">{medicamento.Cobertura}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    
    </div>
  );
}

export default Medicamentos;