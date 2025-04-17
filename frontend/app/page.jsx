import UserInfo from "@/components/UserInfo";

export default function Home() {
  //throw new Error('Solo se pueden registrar correos que terminen en usb.ve');
  return (
    <div className="grid place-items-center h-screen -mt-24">
      <UserInfo />
    </div>
  );
}
