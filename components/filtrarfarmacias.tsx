import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Local from './local'; // Importe o componente Local

// Define o tipo do objeto Farmacia com as propriedades corretas
interface Farmacia {
    UF: string;
    'MUNICÍPIO': string;
    'FARMÁCIA': string;
    'ENDEREÇO': string;
    'BAIRRO': string;
}

function Farmacia(): React.ReactElement {
    const [Farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showTable, setShowTable] = useState(false);
    const [filterUF, setFilterUF] = useState('');
    const [filterMunicipio, setFilterMunicipio] = useState('');
    const [filterBairro, setFilterBairro] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(40); // Define o limite de linhas por página

    useEffect(() => {
        const btnFarmacia = document.getElementById('btn-Farmacia');
        if (btnFarmacia) {
            btnFarmacia.addEventListener('click', async () => {
                try {
                    // Carrega o arquivo XLSX diretamente da pasta do projeto
                    const response = await fetch('farmacias.xlsx');
                    if (!response.ok) {
                        throw new Error('Erro ao carregar o arquivo.');
                    }

                    const workbook = await XLSX.read(await response.arrayBuffer(), { type: 'array' });
                    const sheetNames = workbook.SheetNames;
                    const worksheet = workbook.Sheets[sheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(worksheet);
                    setFarmacias(data as Farmacia[]);
                } catch (err: unknown) {
                    if (typeof err === 'string') {
                        setError(err);
                    }
                }
            });
        }
    }, []);

    // Função para filtrar as farmácias
    const filteredFarmacias = Farmacias.filter((farmacia) => {
        return (
            (filterUF === '' || farmacia.UF.toLowerCase().includes(filterUF.toLowerCase())) &&
            (filterMunicipio === '' || farmacia['MUNICÍPIO'].toLowerCase().includes(filterMunicipio.toLowerCase())) &&
            (filterBairro === '' || farmacia['BAIRRO'].toLowerCase().includes(filterBairro.toLowerCase()))
        );
    });

    // Função para calcular o índice inicial e final dos itens da página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFarmacias = filteredFarmacias.slice(indexOfFirstItem, indexOfLastItem);

    // Função para mudar para a página anterior
    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    // Função para mudar para a página seguinte
    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    // Função para atualizar os filtros com as informações do endereço
    const handleLocationChange = (endereco: { UF: string; Município: string; Bairro: string }) => {
      setFilterUF(endereco.UF);
      setFilterMunicipio(endereco.Município);
      setFilterBairro(endereco.Bairro);
    };
    
    return (
        
        <div className='buttons'>
            
            <button onClick={() => setShowTable(!showTable)} id="btn-Farmacia">
                {showTable ? 'Fechar tabela de farmacias' : 'Abrir tabela de farmacias'}
            </button>
            {error ? (
                <div>Error: {error}</div>
            ) : (
                <>
                    {showTable && (
                        <div className="display: flex py-3 text-3xl  font-semibold text-center table-responsive">
                            {/* Campos de filtro */}
                            <div className='p-2'>
                                <label className= 'p-1 border-collapse' htmlFor="filterUF">UF:</label>
                                <input 
                                    className='rounded-full border-black border-4 text-center'
                                    type="text" 
                                    id="filterUF" 
                                    value={filterUF} 
                                    onChange={(e) => setFilterUF(e.target.value)} 
                                />
                            </div>
                            <div className='p-2'>
                                <label htmlFor="filterMunicipio">Município:</label>
                                <input  
                                     className='rounded-full border-black border-4 text-center'
                                    type="text" 
                                    id="filterMunicipio" 
                                    value={filterMunicipio} 
                                    onChange={(e) => setFilterMunicipio(e.target.value)} 
                                />
                            </div>
                            <div className='p-2'>
                                <label htmlFor="filterBairro">Bairro:</label>
                                <input 
                                     className='rounded-full border-black border-4 text-center'
                                    type="text" 
                                    id="filterBairro" 
                                    value={filterBairro} 
                                    onChange={(e) => setFilterBairro(e.target.value)} 
                                />
                            </div>
                        </div>
                    )}
                    {showTable && (
                        <table className="border-collapse border border-gray-400 w-full">
                            <thead>
                                <tr>
                                    <th>UF</th>
                                    <th>MUNICÍPIO</th>
                                    <th>FARMÁCIA</th>
                                    <th>ENDEREÇO</th>
                                    <th>BAIRRO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFarmacias.map((farmacia, index) => (
                                    <tr key={index} className="border-b border-gray-400">
                                        <td>{farmacia.UF}</td>
                                        <td>{farmacia['MUNICÍPIO']}</td>
                                        <td>{farmacia['FARMÁCIA']}</td>
                                        <td>{farmacia['ENDEREÇO']}</td>
                                        <td>{farmacia['BAIRRO']}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {/* Botões de navegação entre as páginas */}
                    {showTable && (
                        <div className="pagination">
                            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                Anterior
                            </button>
                            <span>Página {currentPage}</span>
                            <button onClick={handleNextPage} disabled={indexOfLastItem >= filteredFarmacias.length}>
                                Próximo
                            </button>
                            <div className='bg-white text-white'>
            <Local onLocationChange={handleLocationChange} /> 
            </div>
                        </div>
                    )}
                    
                </>
            )}
        </div>
    );
}

export default Farmacia;