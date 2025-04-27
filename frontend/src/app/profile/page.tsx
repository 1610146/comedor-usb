"use client"
import React, {  useRef, useState } from 'react';
import Head from 'next/head';
import { Html5QrcodeScanner } from "html5-qrcode";
import toast, { Toaster } from 'react-hot-toast';

const QrScannerPage = () => {
const [scanResult, setScanResult] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  
  const startScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        'reader',
        {
          qrbox: { width: 250, height: 250 },
          fps: 5,
        },
        false
      );

      const success = async (result: string) => {
        
        if (scannerRef.current &&  (result != scanResult) ) {
          setScanResult(result);
  
          const requestBody = JSON.stringify({
            estudianteID: result,
          });
        try{
          const response = await fetch('http://localhost:5500/api/ticket/consume-ticket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          });
    
          const responseData = await response.json(); // Parsear la respuesta JSON
    
          if (response.ok) {
            toast.success(responseData.message);
            console.log('Éxito:', responseData);
            // Realiza cualquier otra acción necesaria después de consumir el ticket
          } else {
            toast.error(responseData.message);
            console.error('Error:', responseData);
            // Maneja el error según sea necesario
          }
        } catch (error) {
          toast.error('Error al comunicarse con el servidor');
          console.error('Error en la petición:', error);
        }        

          //scannerRef.current.clear();
          //setScanResult(result);
          //scannerRef.current = null; // Limpiar la referencia después de escanear
       }
      };

      const error = (err: unknown) => {
        //toast.error('QR code scan error');
        console.log('QR code scan error' +err);
      };

      scannerRef.current.render(success, error);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
      console.log('Escáner detenido');
    }
  };

  return (
    <div>
      <Head>
        <title>Lector de Código QR</title>
      </Head>
      <div className="container">
        <h1 className="text-center my-4">Lector de Código QR</h1>
     
       
          <div>

            <div><Toaster   position="top-center"   reverseOrder={false}/></div>
            <div id="reader" style={{ width: '300px' }}></div>
            <button onClick={startScanner} className="btn btn-primary mt-2">Iniciar Escáner</button>
            {scannerRef.current && (
              <button onClick={stopScanner} className="btn btn-secondary mt-2">Detener Escáner</button>
            )}
          </div>
       
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        #reader {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default QrScannerPage;