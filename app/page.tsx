"use client";

import { useState } from "react";

const Home = () => {
  const [text] = useState("Bem-vindo ao Barber");

  return (
    <div className="text-center text-red-500 text-2xl font-bold py-12">
      {text}
    </div>
  );
};

export default Home;
