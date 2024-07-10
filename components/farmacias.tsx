import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
// Define o tipo do objeto Farmacia com as propriedades corretas
interface Farmacia {
    UF: string;
    'MUNICÍPIO': string;
    'FARMÁCIA': string;
    'ENDEREÇO': string;
    'BAIRRO': string;
    
}

function Farmacias(): React.ReactElement {
    const [Farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showTable, setShowTable] = useState(false);

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

                    // Lê o arquivo como um ArrayBuffer
                    const workbook = await XLSX.read(await response.arrayBuffer(), { type: 'array' });
                    const sheetNames = workbook.SheetNames;
                    const worksheet = workbook.Sheets[sheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(worksheet);

                    // Define o tipo de dados para o array de Farmacias
                    setFarmacias(data as Farmacia[]);


                } catch (err: unknown) {
                    if (typeof err === 'string') {
                        setError(err);
                    }
                }
            });
        }
    }, []);

    return (
        // Altera o estado para mostrar/esconder a tabela
        // Verifica o estado atual e define o estado para mostrar/esconder a tabela
        <div className='buttons'>
            <button onClick={() => setShowTable(!showTable)} id="btn-Farmacia">
                {showTable ? 'Fechar tabela de remedios' : 'Abrir tabela de remedios'}</button>
            {error ? (
                <div>Error: {error}</div>
            ) : (
                showTable && // Check if the table should be displayed
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
                        {Farmacias.map((Farmacia, index) => (
                            <tr key={index} className="border-b border-gray-400">
                                <td>{Farmacia.UF}</td>
                                <td>{Farmacia['MUNICÍPIO']}</td>
                                <td>{Farmacia['FARMÁCIA']}</td>
                                <td>{Farmacia['ENDEREÇO']}</td>
                                <td>{Farmacia['BAIRRO']}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Farmacias;