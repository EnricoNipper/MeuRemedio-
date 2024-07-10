import React, { useState, useEffect } from 'react';

interface Endereco {
  nome: string;
  latitude: number;
  longitude: number;
  distancia?: number; 
}

function FiltrarPorProximidade() {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [enderecosFiltrados, setEnderecosFiltrados] = useState<Endereco[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carrega os endereços da sua fonte de dados (ex: arquivo JSON, API)
    const enderecosExemplo: Endereco[] = [
      { nome: 'Endereço 1', latitude: -23.5505, longitude: -46.6333 },
      { nome: 'Endereço 2', latitude: -22.9068, longitude: -43.1729 },
      // Adicione mais endereços aqui...
    ];
    setEnderecos(enderecosExemplo);

    // Obter a localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocalização não suportada pelo navegador.');
    }
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null && enderecos.length > 0) {
      // Calcula a distância entre a localização do usuário e cada endereço usando a API do Google Maps
      const promises = enderecos.map((endereco) => {
        return fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${latitude},${longitude}&destinations=${endereco.latitude},${endereco.longitude}&key=AIzaSyBjXjfinpxo_fLUoNlmm5MlWsX7c9ByskIa`
        )
          .then((response) => response.json())
          .then((data) => ({
            ...endereco,
            distancia: data.rows[0].elements[0].distance.value, // Distância em metros
          }));
      });

      Promise.all(promises).then((enderecosComDistancia) => {
        // Ordena os endereços por distância
        enderecosComDistancia.sort((a, b) => a.distancia - b.distancia);

        // Define os endereços filtrados (os 5 mais próximos)
        setEnderecosFiltrados(enderecosComDistancia.slice(0, 5));
      });
    }
  }, [latitude, longitude, enderecos]);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {enderecosFiltrados.length > 0 && (
        <ul>
          {enderecosFiltrados.map((endereco) => (
            <li key={endereco.nome}>
              {endereco.nome} - Distância: {endereco.distancia} metros
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FiltrarPorProximidade;