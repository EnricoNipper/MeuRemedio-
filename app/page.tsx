"use client";
import Farmacias from "@/components/farmacias";
import Farmacia from "@/components/filtrarfarmacias";
import Local from "@/components/local";
import FiltrarPorProximidade from "@/components/maisproximo";
import Medicamentos from "@/components/medicamentos";
import Head from "next/head";


export default function Home() {

  return (
    <div>
      <Head>
        <title>Seu Remedio</title> {/* Define o título da página */}
        <meta name="description" content="Remedios" /> {/* Define a descrição da página */}
        <link rel="icon" href="/icon.ico" /> {/* Define o ícone da página */}
      </Head>

      <main className="overflow-x-hidden bg-blue px-10 dark:bg-gray-900 md:px-20 lg:px-40"> {/* Define o estilo da página principal */}
      </main>
    <h1>Meu Remédio</h1>

    
        <Local /> 
        <Medicamentos/>
        <Farmacia/>
  
    </div>
 );
}