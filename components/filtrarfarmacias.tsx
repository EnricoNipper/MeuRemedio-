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
            <div className="p-10  flex justify-center items-center">

                <div className="relative inline-flex  group">
                    <div
                        className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt">
                    </div>
                    <button className='relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900' onClick={() => setShowTable(!showTable)} id="btn-Farmacia">
                        {showTable ? 'Fechar tabela de farmacias' : 'Abrir tabela de farmacias'}
                    </button>
                </div>
            </div>


            {error ? (
                <div>Error: {error}</div>
            ) : (
                <>
                    {showTable && (
                        <div className=" text-lg font-bold  p-6">

                            {/* Campos de filtro */}
                            <div className='text-lg font-bold  p-6 '>
                                <label className='p-1 border-collapse' htmlFor="filterUF">UF:</label>
                                <input
                                    className='text-black rounded-full border-black border-4 text-center'
                                    type="text"
                                    id="filterUF"
                                    value={filterUF}
                                    onChange={(e) => {setFilterUF(e.target.value); setCurrentPage(1);}}
                                />
                            </div>
                            <div className='p-2'>
                                <label htmlFor="filterMunicipio">Município:</label>
                                <input
                                    className=' text-black rounded-full border-black border-4 text-center'
                                    type="text"
                                    id="filterMunicipio"
                                    value={filterMunicipio}
                                    onChange={(e) => {setFilterMunicipio(e.target.value); setCurrentPage(1);}}
                                />
                            </div>
                            <div className='p-2'>
                                <label htmlFor="filterBairro">Bairro:</label>
                                <input
                                    className='text-black rounded-full border-black border-4 text-center'
                                    type="text"
                                    id="filterBairro"
                                    value={filterBairro}
                                    onChange={(e) => {setFilterBairro(e.target.value); setCurrentPage(1);}}
                                />
                            </div>
                        </div>
                    )}
                    {showTable && (
                        <div className="flex flex-auto">
                            <div className="overflow-x-auto ">
                                <div className="  basis-1/3 flex-1">
                                    <div className="overflow-hidden w-full"> {/* Adicione w-full para controlar a largura */}

                                        <table className="border-collapse border border-gray-400 w-full">
                                            <thead className=" border-b">
                                                <tr>
                                                    <th className="text-base font-bold px-1 text-left">UF</th>
                                                    <th className="text-base font-bold px-1 text-left">MUNICÍPIO</th>
                                                    <th className="text-base font-bold px-1 text-left">FARMÁCIA</th>
                                                    <th className="text-base font-bold px-1 text-left">ENDEREÇO</th>
                                                    <th className="text-base font-bold px-1 text-left">BAIRRO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentFarmacias.map((farmacia, index) => (
                                                    <tr key={index} className="border-b border-gray-400">
                                                        <td className="text-xs font-bold px-1 text-left">{farmacia.UF}</td>
                                                        <td className="text-xs font-bold px-1 text-left">{farmacia['MUNICÍPIO']}</td>
                                                        <td className="text-xs font-bold px-1 text-left">{farmacia['FARMÁCIA']}</td>
                                                        <td className="text-xs font-bold px-1 text-left">{farmacia['ENDEREÇO']}</td>
                                                        <td className="text-xs font-bold px-1 text-left">{farmacia['BAIRRO']}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
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
                            <Local onLocationChange={handleLocationChange} />
                            <Local />
                            <div className='bg-white text-white'></div>
                        </div>
                    )}

                </>
            )}
        </div>
    );
}

export default Farmacia;