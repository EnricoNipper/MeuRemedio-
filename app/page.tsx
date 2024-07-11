"use client";
import Farmacia from "@/components/filtrarfarmacias";
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
    <div className=" bg-slate-700">
    <div className="max-w-2xl mx-auto text-center mt-6">
    <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2 pb-4 relative">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Meu Remédio</span>
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
    </h1>
</div>
<div className="max-w-2xl mx-auto text-center mt-6 ">
            <h1 className="text-white text-4xl font-bold">Descubra se o seu medicamento está disponível  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"> gratuitamente</span> </h1>
            <h2 className=" text-white text-4xl  font-bold"> ou com desconto no Farmácia Popular! </h2>
            <p className="p-2 text-white  font-bold mb-10">O programa do governo oferece diversos medicamentos para diversos tratamentos, com alguns totalmente gratuitos e outros com até 90% de desconto. Consulte a lista completa de medicamentos e encontre a farmácia mais próxima para retirá-los.</p>

</div>
      <div className="max-w-2xl mx-auto text-center mt-6">
        
        <Medicamentos/>
        <Farmacia/>
        </div>
      </div>
    </div>
 );
}