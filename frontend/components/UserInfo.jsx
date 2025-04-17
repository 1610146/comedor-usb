"use client";
import Image from "next/image";
import SignInBtn from "./SignInBtn";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import QrCode from "qrcode";

export default function UserInfo() {
  const { status, data: session } = useSession();
  const [qrCodeData, setQrCodeData] = useState(null);
  //const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const SIZE = 500;

  useEffect(() => {
    const fetchImage = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          // Assuming your API endpoint to fetch the image is /api/image
          const response = await fetch(`http://localhost:5500/api/data?email=${session.user.email}`);
                              
     
          if (response.ok) {
            const data = await response.json();        
            setQrCodeData(data.qrCode);
          } else {
            console.error("Error fetching image:", response.status);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchImage();
  }, [session?.user?.email, status]);

  if (status === "authenticated") {
    return (
      
      <div className="shadow-xl p-8 rounded-md flex flex-col gap-3 bg-yellow-200">
        

        {isLoading ? (
          <div>Loading QR code...</div>
        ) : qrCodeData ? (
          <div>
          <img
            src={qrCodeData}
            alt="Base64 Image"
            width={300} // Adjust width as needed
            height={300} // Adjust height as needed
            style={{ 
              padding: '5px',  // Add padding
              borderRadius: '5px'  // Add rounded corners
            }} 
            
          />
        </div>
        ) : (
          <div>QR code not available</div>
        )}
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
      
      </div>
      
    );
  } else {
    return <SignInBtn />;
  }


/*
import Image from "next/image";
import SignInBtn from "./SignInBtn";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import QrCode from "qrcode";

export default function UserInfo() {
  const { status, data: session } = useSession();
  const [qrCodeData, setQrCodeData] = useState(null);
  //const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const SIZE = 500;

   useEffect(() => {
    const fetchImage = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          // Assuming your API endpoint to fetch the image is /api/image
          const response = await fetch(`http://localhost:5500/api/data?email=${session.user.email}`);
          
        
         
        
     
          if (response.ok) {
            const data = await response.json();        
            setQrCodeData(data.qrCode);
          } else {
            console.error("Error fetching image:", response.status);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchImage();
  }, [session?.user?.email, status]);*/

  /*if (status === "authenticated") {
    return (
      
      /*<div className="shadow-xl p-8 rounded-md flex flex-col gap-3 bg-yellow-200">
        

        {isLoading ? (
          <div>Loading QR code...</div>
        ) : qrCodeData ? (
          <div>
          <img
            src={qrCodeData}
            alt="Base64 Image"
            width={300} // Adjust width as needed
            height={300} // Adjust height as needed
            style={{ 
              padding: '5px',  // Add padding
              borderRadius: '5px'  // Add rounded corners
            }} 
            
          />
        </div>
        ) : (
          <div>QR code not available</div>
        )}
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
      
      </div>
      
    );
  } else {
    return <SignInBtn />;
  }*/
  
}



