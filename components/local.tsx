import React, { useState, useEffect } from 'react';

interface LocalProps {
  onLocationChange?: (endereco: { UF: string; Município: string; Bairro: string }) => void; // Adicione o ? para tornar a propriedade opcional
}

const estadosSiglas = {
  "Acre": "AC",
  "Alagoas": "AL",
  "Amapá": "AP",
  "Amazonas": "AM",
  "Bahia": "BA",
  "Ceará": "CE",
  "Distrito Federal": "DF",
  "Espírito Santo": "ES",
  "Goiás": "GO",
  "Maranhão": "MA",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  "Pará": "PA",
  "Paraíba": "PB",
  "Paraná": "PR",
  "Pernambuco": "PE",
  "Piauí": "PI",
  "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS",
  "Rondônia": "RO",
  "Roraima": "RR",
  "Santa Catarina": "SC",
  "São Paulo": "SP",
  "Sergipe": "SE",
  "Tocantins": "TO"
};

function Local(props: LocalProps) {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [endereco, setEndereco] = useState({
    UF: '',
    Município: '',
    Bairro: '',
  });

  useEffect(() => {
    const btnLocalizacao = document.getElementById('btn-localizacao');

    if (btnLocalizacao) {
      btnLocalizacao.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);
              setError(null);

              fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=16`)
                .then(response => response.json())
                .then(data => {
                  if (data.address) {
                    // Encontre a sigla do estado correspondente
                    const ufSigla = Object.entries(estadosSiglas).find(([estado, sigla]) => estado.toLowerCase() === data.address.state.toLowerCase())?.[1] || '';

                    const newEndereco = {
                      UF: ufSigla, 
                      Município: data.address.city || '',
                      Bairro: data.address.suburb || data.address.neighbourhood || '', 
                    };
                    setEndereco(newEndereco);
                    if (props.onLocationChange) {
                      props.onLocationChange(newEndereco); // Notifica o componente Farmacia
                    }
                  } else {
                    setError('Não foi possível obter o endereço.');
                  }
                })
                .catch(error => {
                  setError('Erro ao obter o endereço.');
                })
                .catch(error => {
                  setError('Erro ao obter o endereço.');
                });

            },
            (error) => {
              setError(error.message);
            }
          );
        } else {
          setError('Geolocalização não suportada pelo navegador.');
        }
      });
    }
  }, []);

  return (
    <div className='buttons'>
      <button onClick={() => setIsOpen(!isOpen)} id="btn-localizacao">
        {isOpen ? 'Fechar sua localização' : 'Qual sua localização'}
      </button>
      {isOpen && (
        <>
          {latitude && longitude && (
            <p>Latitude: {latitude}, Longitude: {longitude}</p>
          )}
          {endereco && (
            <>
              <p>UF: {endereco.UF}</p>
              <p>Município: {endereco.Município}</p>
              <p>Bairro: {endereco.Bairro}</p>
            </>
          )}
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}
export default Local;