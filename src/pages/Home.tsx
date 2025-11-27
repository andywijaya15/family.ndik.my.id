import Layout from "@/components/layouts/Layout";
import { useEffect } from "react";

type WeeklyMenu = {
  day: string;
  menu: string;
  date: string;
};

export default function Home() {
  useEffect(() => {}, []);

  return (
    <Layout title="Home">
      <div className="space-y-4"></div>
    </Layout>
  );
}
