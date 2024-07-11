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
  const [isLocalizacaoObtida, setIsLocalizacaoObtida] = useState(false); // Estado para controlar se a localização foi obtida

  useEffect(() => { // Sem dependências, ele será executado apenas uma vez quando o componente for montado
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
                const ufSigla = Object.entries(estadosSiglas).find(([estado, sigla]) => estado.toLowerCase() === data.address.state.toLowerCase())?.[1] || '';

                const newEndereco = {
                  UF: ufSigla, 
                  Município: data.address.city || '',
                  Bairro: data.address.suburb || data.address.neighbourhood || '', 
                };
                setEndereco(newEndereco);
                setIsLocalizacaoObtida(true);
                if (props.onLocationChange) {
                  props.onLocationChange(newEndereco);
                }
              } else {
                setError('Não foi possível obter o endereço.');
              }
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
  }, []); // Sem dependências, o useEffect será executado apenas uma vez quando o componente for montado

  return null;
}

export default Local;