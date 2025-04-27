"use client"; 
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScannerPage = () => {
  const [scanResult, setScanResult] = useState<string>('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },   false
    );

    function success(result: string) {
      scanner.clear();
      setScanResult(result);
    }

    function error(err: unknown) {
      // Puedes manejar el error aquí si lo deseas
      console.error('QR code scan error', err);
    }

    scanner.render(success, error);

    return () => {
      console.log('Limpiando el escáner');
      scanner.clear();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Lector de Código QR</title>
      </Head>
      <div className="container">
        <h1 className="text-center my-4">Lector de Código QR</h1>
        {scanResult ? (
          <div className="alert alert-success mt-3" role="alert">
            Resultado del escaneo: <a href={'http://' + scanResult} target="_blank" rel="noopener noreferrer">{scanResult}</a>
          </div>
        ) : (
          <div id="reader" style={{ width: '300px' }}></div>
        )}
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